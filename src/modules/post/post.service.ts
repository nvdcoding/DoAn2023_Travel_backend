import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from 'src/models/repositories/post.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { AdminAction, PostStatus } from 'src/shares/enum/post.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In, IsNull, Not } from 'typeorm';
import { CreateBlogDto } from './dtos/create-post.dto';
import { AdminGetPostDto, GetPostDto } from './dtos/get-post.dto';
import { UpdateBlogDto } from './dtos/update-post.dto';
import {
  AdminApproveRequest,
  UpdateStatusBlogDto,
} from './dtos/update-status.dto';
@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly tourGuideRepository: TourGuideRepository,
  ) {}

  async getPostByStatus(options: AdminGetPostDto): Promise<Response> {
    const { status, limit, page, keyword } = options;
    const tourGuides = await this.postRepository.getPostByStatusAndKeyword(
      keyword,
      status,
      page,
      limit,
    );
    return {
      ...httpResponse.GET_POST_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        tourGuides,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async getOnePost(postId: number, role?: string) {
    const relations =
      role === 'admin'
        ? ['comments', 'userFavorites', 'user', 'tourGuide', 'reports']
        : ['comments', 'userFavorites', 'user', 'tourGuide'];
    const where = {
      id: postId,
    };
    if (role !== 'admin') {
      where['status'] = In([PostStatus.ACTIVE, PostStatus.WAITING]);
    }
    const post = await this.postRepository.findOne({
      where,
      relations,
    });
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { ...httpResponse.GET_POST_SUCCESS, returnValue: post };
  }

  async getTopPost(): Promise<Response> {
    const topPosts = await this.postRepository.find({
      take: 10,
      order: {
        like: 'DESC',
      },
    });
    return { ...httpResponse.GET_POST_SUCCESS, returnValue: topPosts };
  }

  async getListPost(options: GetPostDto): Promise<Response> {
    const { topics, limit, page, keyword } = options;

    const posts = await this.postRepository.getPostByKeywordAndType(
      keyword,
      topics,
      page,
      limit,
    );
    return {
      ...httpResponse.GET_POST_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        posts,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async adminUpdateStatusPost(body: UpdateStatusBlogDto) {
    const { postId, status } = body;
    if (![PostStatus.ACTIVE, PostStatus.REJECTED].includes(status)) {
      throw new HttpException(
        httpErrors.INVALID_PARAMS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.postRepository.update({ id: postId }, { status });
    return httpResponse.APPROVE_POST_SUCCESS;
  }

  async createPost(
    body: CreateBlogDto,
    actorId: number,
    role: ActorRole,
  ): Promise<Response> {
    if (role === ActorRole.ADMIN) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { content, title, image, topic } = body;

    const [post, actor] = await Promise.all([
      this.postRepository.findOne({
        title,
      }),
      role === ActorRole.USER
        ? this.userRepository.findOne({
            where: {
              id: actorId,
              verifyStatus: UserStatus.ACTIVE,
            },
          })
        : this.tourGuideRepository.findOne({
            where: { id: actorId, verifyStatus: TourguideStatus.ACTIVE },
          }),
    ]);
    if (post) {
      throw new HttpException(httpErrors.POST_EXISTED, HttpStatus.FOUND);
    }
    if (!actor) {
      throw new HttpException(
        role === ActorRole.USER
          ? httpErrors.USER_NOT_FOUND
          : httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const saveData = {
      title,
      currentContent: content,
      image: image ? image : null,
      status: PostStatus.PENDING,
      topic,
      updateContent: null,
    };
    if (role === ActorRole.USER) {
      saveData['user'] = actor;
    } else {
      saveData['tourGuide'] = actor;
    }
    await this.postRepository.insert({
      ...saveData,
    });
    return { ...httpResponse.CREATE_POST_SUCCESS };
  }

  async updatePost(
    body: UpdateBlogDto,
    actorId: number,
    role: ActorRole,
  ): Promise<Response> {
    const { content, postId } = body;
    if (role === ActorRole.ADMIN) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const [post, actor] = await Promise.all([
      this.postRepository.findOne({
        where: { id: postId },
      }),
      role === ActorRole.USER
        ? this.userRepository.findOne({
            where: {
              id: actorId,
              verifyStatus: UserStatus.ACTIVE,
            },
          })
        : this.tourGuideRepository.findOne({
            where: { id: actorId, verifyStatus: TourguideStatus.ACTIVE },
          }),
    ]);
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!actor) {
      throw new HttpException(
        role === ActorRole.USER
          ? httpErrors.USER_NOT_FOUND
          : httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const saveData = {
      status: PostStatus.WAITING,
      updateContent: content,
    };
    if (role === ActorRole.USER) {
      saveData['user'] = actor;
    } else {
      saveData['tourGuide'] = actor;
    }
    await this.postRepository.insert({
      ...saveData,
    });
    return httpResponse.REQUEST_UPDATE_POST_SUCCESS;
  }

  async approveUpdateRequest(body: AdminApproveRequest): Promise<Response> {
    const { postId, action } = body;
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        status: PostStatus.WAITING,
      },
    });
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.postRepository.update(
      { id: post.id },
      {
        status: PostStatus.ACTIVE,
        currentContent:
          action === AdminAction.APPROVE
            ? post.updateContent
            : post.currentContent,
        updateContent: null,
      },
    );
    return httpResponse.UPDATE_POST_SUCCESS;
  }

  async deletePost(postId: number, actorId: number, role: ActorRole) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'tourGuide'],
    });
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (role === ActorRole.ADMIN) {
      await this.postRepository.softDelete(post.id);
    } else {
      const actor =
        role === ActorRole.USER
          ? await this.userRepository.findOne({
              id: actorId,
              verifyStatus: UserStatus.ACTIVE,
            })
          : await this.tourGuideRepository.findOne({
              where: {
                id: actorId,
                verifyStatus: UserStatus.ACTIVE,
              },
            });
      const postIdActor =
        role === ActorRole.USER ? post.user.id : post.tourGuide.id;
      if (actor.id !== postIdActor) {
        throw new HttpException(
          httpErrors.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return httpResponse.DELETE_POST_SUCCESS;
  }
}
