import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepository } from 'src/models/repositories/comment.repository';
import { PostRepository } from 'src/models/repositories/post.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { PostStatus } from 'src/shares/enum/post.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In } from 'typeorm';
import {
  CommentDto,
  GetCommentDto,
  UpdateCommentDto,
} from './dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly tourGuideRepository: TourGuideRepository,
  ) {}

  async createComment(
    body: CommentDto,
    actorId: number,
    actorRole: ActorRole,
  ): Promise<Response> {
    const { content, parrentCommentId, postId } = body;
    if (actorRole === ActorRole.USER) {
      const [user, post] = await Promise.all([
        this.userRepository.findOne({
          where: {
            id: actorId,
            verifyStatus: UserStatus.ACTIVE,
          },
        }),
        this.postRepository.findOne({
          where: {
            id: postId,
            status: In([PostStatus.ACTIVE, PostStatus.WAITING]),
          },
        }),
      ]);
      let parrentComment;
      if (parrentCommentId) {
        parrentComment = await this.commentRepository.findOne(parrentCommentId);
      }

      if (!user) {
        throw new HttpException(
          httpErrors.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!post) {
        throw new HttpException(
          httpErrors.POST_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.commentRepository.insert({
        content,
        user,
        post,
        parrentComment: parrentComment ? parrentComment : null,
      });
    } else if (actorRole === ActorRole.TOURGUIDE) {
      const [tourGuide, post] = await Promise.all([
        this.tourGuideRepository.findOne({
          where: {
            id: actorId,
            verifyStatus: TourguideStatus.ACTIVE,
          },
        }),
        this.postRepository.findOne({
          where: {
            id: postId,
            status: In([PostStatus.ACTIVE, PostStatus.WAITING]),
          },
        }),
      ]);
      let parrentComment;
      if (parrentCommentId) {
        parrentComment = await this.commentRepository.findOne(parrentCommentId);
      }

      if (!tourGuide) {
        throw new HttpException(
          httpErrors.TOUR_GUIDE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!post) {
        throw new HttpException(
          httpErrors.POST_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.commentRepository.insert({
        content,
        tourGuide: tourGuide,
        post,
        parrentComment: parrentComment ? parrentComment : null,
      });
    } else {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return httpResponse.CREATE_COMMENT_SUCCESS;
  }

  async getPostComment(options: GetCommentDto): Promise<Response> {
    const { postId, page, limit } = options;
    const post = await this.postRepository.findOne({
      where: {
        id: +postId,
        status: In([PostStatus.ACTIVE, PostStatus.WAITING]),
      },
    });
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const comment = await this.commentRepository.findAndCount({
      where: { post },
      relations: [
        'user',
        'post',
        'parrentComment',
        'parrentComment.subcomments',
      ],
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      order: {
        id: 'DESC',
      },
    });
    return {
      ...httpResponse.GET_COMMENT_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        comment,
        page,
        limit,
      ),
    };
  }

  async updateComment(
    body: UpdateCommentDto,
    actorId: number,
    actorRole: ActorRole,
  ) {
    const { commentId, content } = body;
    if (actorRole === ActorRole.USER) {
      const user = await this.userRepository.findOne({
        id: actorId,
        verifyStatus: UserStatus.ACTIVE,
      });
      if (!user) {
        throw new HttpException(
          httpErrors.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const comment = await this.commentRepository.findOne({
        user,
        id: commentId,
      });
      if (!comment) {
        throw new HttpException(
          httpErrors.COMMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      comment.content = content;
      const updatedComment = await this.commentRepository.save(comment);
    } else if (actorRole === ActorRole.TOURGUIDE) {
      const tourGuide = await this.tourGuideRepository.findOne({
        id: actorId,
        verifyStatus: TourguideStatus.ACTIVE,
      });
      if (!tourGuide) {
        throw new HttpException(
          httpErrors.TOUR_GUIDE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const comment = await this.commentRepository.findOne({
        tourGuide: tourGuide,
        id: commentId,
      });
      if (!comment) {
        throw new HttpException(
          httpErrors.COMMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      comment.content = content;
      const updatedComment = await this.commentRepository.save(comment);
    } else {
      throw new HttpException(
        httpErrors.COMMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return httpResponse.UPDATE_COMMENT_SUCCESS;
  }

  async deleteComment(
    commentId: number,
    actorId: number,
    actorRole: ActorRole,
  ): Promise<Response> {
    if (actorRole === ActorRole.USER) {
      const user = await this.userRepository.findOne({
        id: actorId,
        verifyStatus: UserStatus.ACTIVE,
      });
      if (!user) {
        throw new HttpException(
          httpErrors.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const comment = await this.commentRepository.findOne({
        where: { id: commentId, user },
        relations: ['subcomments'],
      });
      if (!comment) {
        throw new HttpException(
          httpErrors.COMMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (comment.subcomments && comment.subcomments.length > 0) {
        const subcommentIds = comment.subcomments.map(
          (subcomment) => subcomment.id,
        );
        await this.commentRepository.delete(subcommentIds);
      }
      await this.commentRepository.delete(comment.id);
    } else if (actorRole === ActorRole.TOURGUIDE) {
      const tourGuide = await this.tourGuideRepository.findOne({
        id: actorId,
        verifyStatus: TourguideStatus.ACTIVE,
      });
      if (!tourGuide) {
        throw new HttpException(
          httpErrors.TOUR_GUIDE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const comment = await this.commentRepository.findOne({
        where: { id: commentId, tourGuide: tourGuide },
        relations: ['subcomments'],
      });
      if (!comment) {
        throw new HttpException(
          httpErrors.COMMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (comment.subcomments && comment.subcomments.length > 0) {
        const subcommentIds = comment.subcomments.map(
          (subcomment) => subcomment.id,
        );
        await this.commentRepository.delete(subcommentIds);
      }
      await this.commentRepository.delete(comment.id);
    } else {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return httpResponse.DELETE_COMMENT_SUCCESS;
  }
}
