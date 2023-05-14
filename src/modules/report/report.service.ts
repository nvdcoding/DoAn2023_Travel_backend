import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from 'src/models/repositories/post.repository';
import { ReportRepository } from 'src/models/repositories/report.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { PostStatus } from 'src/shares/enum/post.enum';
import { GetReportStatus, ReportStatus } from 'src/shares/enum/report.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In, IsNull, Not } from 'typeorm';
import { GetReportDto } from './dtos/get-report.dto';
import { ReportPostDto } from './dtos/report-post.dto';
@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async reportPost(body: ReportPostDto, userId: number): Promise<Response> {
    const { content, postId } = body;
    const [post, user] = await Promise.all([
      this.postRepository.findOne({
        id: postId,
        status: In([PostStatus.ACTIVE, PostStatus.WAITING]),
      }),
      this.userRepository.findOne({
        where: {
          id: userId,
          verifyStatus: UserStatus.ACTIVE,
        },
      }),
    ]);
    if (!post) {
      throw new HttpException(httpErrors.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.reportRepository.insert({
      content,
      reportedBy: user,
      post,
    });

    return httpResponse.CREATE_REPORT_SUCCESS;
  }

  async getReportPost(options: GetReportDto): Promise<Response> {
    const { status, limit, page } = options;
    const where = {};
    if (status && status === GetReportStatus.PROCESSED) {
      where['status'] = ReportStatus.PROCESSED;
    } else if (status && status === GetReportStatus.PROCESSING) {
      where['status'] = In([ReportStatus.PENDING, ReportStatus.PROSESSING]);
    } else {
      where['status'] = Not(IsNull());
    }
    const reports = await this.reportRepository.findAndCount({
      where: {
        ...where,
        post: Not(IsNull()),
        tourGuide: IsNull(),
      },
      relations: ['post', 'reportedBy'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      ...httpResponse.GET_REPORT_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        reports,
        page,
        limit,
      ),
    };
  }
}
