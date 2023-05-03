import { Injectable } from '@nestjs/common';
import { PostRepository } from 'src/models/repositories/post.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { AdminGetPostDto } from './dtos/get-post.dto';
@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

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
}
