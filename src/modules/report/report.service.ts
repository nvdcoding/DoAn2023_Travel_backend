import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { PostRepository } from 'src/models/repositories/post.repository';
import { ReportRepository } from 'src/models/repositories/report.repository';
import { SystemRepository } from 'src/models/repositories/system.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { OrderStatus } from 'src/shares/enum/order.enum';
import { PostStatus } from 'src/shares/enum/post.enum';
import {
  GetReportStatus,
  HandleReportPostAction,
  ReportStatus,
} from 'src/shares/enum/report.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In, IsNull, Not } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { GetReportDto } from './dtos/get-report.dto';
import { HandleReportPostDto } from './dtos/handle-report-post.dto';
import { CreateMeetingReportDto } from './dtos/meeting-report.dto';
import { ReportPostDto } from './dtos/report-post.dto';
import { ReportOrderDto } from './dtos/report-tourguide.dto';
@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly mailService: MailService,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly systemRepository: SystemRepository,
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
      where['status'] = In([ReportStatus.PENDING, ReportStatus.PROCESSING]);
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

  async deleteReport(reportId: number): Promise<Response> {
    const report = await this.reportRepository.findOne({
      id: reportId,
    });
    if (!report) {
      throw new HttpException(
        httpErrors.REPORT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.reportRepository.delete(report.id);
    return httpResponse.DELETE_REPORT_SUCCESS;
  }

  async handleReportPost(body: HandleReportPostDto): Promise<Response> {
    const { action, reportId } = body;
    const report = await this.reportRepository.findOne({
      where: {
        id: reportId,
        post: Not(IsNull()),
        tourGuide: IsNull(),
      },
      relations: ['post', 'post.reports'],
    });
    if (!report) {
      throw new HttpException(
        httpErrors.REPORT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (action === HandleReportPostAction.SKIP) {
      await this.deleteReport(reportId);
    } else {
      await Promise.all([
        this.reportRepository.softRemove([...report.post.reports]),
        this.postRepository.softDelete(report.post.id),
      ]);
    }
    return httpResponse.HANLED_REPORT;
  }

  async getReportTourguide(options: GetReportDto): Promise<Response> {
    const { status, limit, page } = options;
    const where = {};
    if (status && status === GetReportStatus.PROCESSED) {
      where['status'] = ReportStatus.PROCESSED;
    } else if (status && status === GetReportStatus.PROCESSING) {
      where['status'] = In([ReportStatus.PENDING, ReportStatus.PROCESSING]);
    } else {
      where['status'] = Not(IsNull());
    }
    const reports = await this.reportRepository.findAndCount({
      where: {
        ...where,
        post: IsNull(),
        order: Not(IsNull()),
      },
      relations: ['tourGuide', 'reportedBy'],
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

  async reportOrder(body: ReportOrderDto, userId: number): Promise<Response> {
    const { orderId, content } = body;
    const order = await this.orderRepository.findOne({
      where: { id: orderId, status: OrderStatus.PROCESSING },
      relations: ['user', 'tourGuide'],
    });
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (order.user.id !== userId) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    await this.reportRepository.insert({
      content,
      reportedBy: order.user,
      order,
    });
    return httpResponse.CREATE_REPORT_SUCCESS;
  }

  async setupMeeting(body: CreateMeetingReportDto): Promise<Response> {
    const { reportId, meetingDate } = body;
    const report = await this.reportRepository.findOne({
      where: {
        id: reportId,
        post: Not(IsNull()),
        tourGuide: IsNull(),
        status: ReportStatus.PENDING,
      },
      relations: [
        'post',
        'reportedBy',
        'order',
        'order.tourGuide',
        'order.tour',
      ],
    });
    if (!report) {
      throw new HttpException(
        httpErrors.REPORT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.reportRepository.update(
      { id: reportId },
      { status: ReportStatus.PROCESSING, meetingDate },
    );
    this.mailService.sendCreatMeetingMail({
      email: report.order.tourGuide.email,
      username: report.reportedBy.username,
      name: report.order.tourGuide.name,
      date: meetingDate.toDateString(),
      content: report.content,
      tourName: report.order.tour.name,
    });
    return httpResponse.CREATING_MEETING_REPORT;
  }

  async skipReport(reportId: number): Promise<Response> {
    const report = await this.reportRepository.findOne({
      where: {
        id: reportId,
        status: ReportStatus.PROCESSING,
      },
    });
    if (!report) {
      throw new HttpException(
        httpErrors.REPORT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.deleteReport(reportId);
    return httpResponse.HANLED_REPORT;
  }

  async handleBanReportTourguide(reportId: number): Promise<Response> {
    const [report, system] = await Promise.all([
      this.reportRepository.findOne({
        where: {
          id: reportId,
          status: ReportStatus.PROCESSING,
        },
        relations: ['order', 'order.user', 'order.tourGuide'],
      }),
      this.systemRepository.findOne(),
    ]);
    if (!report) {
      throw new HttpException(
        httpErrors.REPORT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // hoafn tienfg
    await Promise.all([
      this.tourGuideRepository.update(
        { id: report.order.tourGuide.id },
        { verifyStatus: TourguideStatus.REJECT },
      ),
      this.userRepository.update(
        { id: report.order.user.id },
        {
          balance:
            report.order.user.balance +
            report.order.price * (system.returnUserPercent / 100),
          availableBalance:
            report.order.user.availableBalance +
            report.order.price * (system.returnUserPercent / 100),
        },
      ),
      this.systemRepository.update(
        { id: system.id },
        { balance: report.order.price * (system.returnUserPercent / 100) },
      ),
    ]);
    return httpResponse.HANLED_REPORT;
  }

  async handleWarnTourguide(reportId: number): Promise<Response> {
    const [report, system] = await Promise.all([
      this.reportRepository.findOne({
        where: {
          id: reportId,
          status: ReportStatus.PROCESSING,
        },
        relations: ['order', 'order.user', 'order.tourGuide'],
      }),
      this.systemRepository.findOne(),
    ]);
    if (!report) {
      throw new HttpException(
        httpErrors.REPORT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (+report.order.tourGuide.warningTime + 1 === +system.warningTime) {
      await this.tourGuideRepository.update(
        { id: report.order.tourGuide.id },
        {
          verifyStatus: TourguideStatus.REJECT,
          warningTime: +system.warningTime,
        },
      );
    } else {
      await this.tourGuideRepository.update(
        { id: report.order.tourGuide.id },
        {
          warningTime: +system.warningTime,
        },
      );
    }
    // // hoafn tienfg
    await Promise.all([
      this.userRepository.update(
        { id: report.order.user.id },
        {
          balance:
            report.order.user.balance +
            report.order.price * (system.returnUserPercent / 100),
          availableBalance:
            report.order.user.availableBalance +
            report.order.price * (system.returnUserPercent / 100),
        },
      ),
      this.systemRepository.update(
        { id: system.id },
        { balance: report.order.price * (system.returnUserPercent / 100) },
      ),
    ]);
    return httpResponse.HANLED_REPORT;
  }
}
