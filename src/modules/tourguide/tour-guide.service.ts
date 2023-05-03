import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  ActionResponseRegisterTourguide,
  TourguideStatus,
} from 'src/shares/enum/tourguide.enum';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import {
  AdminGetTourGuideDto,
  GetTourGuideDto,
} from './dtos/get-tour-guide.dto';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { ResponseRegisterTourguideDto } from './dtos/response-registation-tourguide.dto';
import { httpErrors } from 'src/shares/exceptions';
import { MailService } from '../mail/mail.service';
import { ResponseInterviewTourguideDto } from './dtos/response-interview.dto';
import { OrderStatus } from 'src/shares/enum/order.enum';
import { UpdateStatusTourGuideDto } from './dtos/update-status-tourguide.dto';

@Injectable()
export class TourGuideService {
  constructor(
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly mailService: MailService,
  ) {}

  // asycn getTourGuide() {

  // };

  async getTourguideByIdUsernameEmail(
    id: number,
    username: string,
    email: string,
  ) {
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id,
        username,
        email,
        verifyStatus: TourguideStatus.ACTIVE,
      },
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return tourGuide;
  }

  async getTourGuidesByStatusAndKeyword(
    options: AdminGetTourGuideDto,
  ): Promise<Response> {
    const { keyword, status, limit, page } = options;

    const tourGuides =
      await this.tourGuideRepository.getTourGuidesByStatusAndKeyword(
        keyword,
        status,
        page,
        limit,
      );
    return {
      ...httpResponse.GET_TOURGUIDE_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        tourGuides,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async responseRegistationTourGuide(
    body: ResponseRegisterTourguideDto,
  ): Promise<Response> {
    const { action, tourGuideId, interviewDate } = body;
    if (action === ActionResponseRegisterTourguide.ACCEPT && !interviewDate) {
      throw new HttpException(
        httpErrors.INTERVIEW_DATE_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tourGuideId,
        verifyStatus: TourguideStatus.PENDING,
      },
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await Promise.all([
      this.tourGuideRepository.update(tourGuideId, {
        verifyStatus:
          action === ActionResponseRegisterTourguide.ACCEPT
            ? TourguideStatus.WAITING_INTERVIEW
            : TourguideStatus.REJECT,
        interviewDate: ActionResponseRegisterTourguide.ACCEPT
          ? interviewDate
          : null,
      }),
      // todo
      // this.mailService.
    ]);
    return httpResponse.RESPONSE_SUCCESS;
  }

  async responseInterview(
    body: ResponseInterviewTourguideDto,
  ): Promise<Response> {
    const { action, tourGuideId } = body;

    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tourGuideId,
        verifyStatus: TourguideStatus.WAITING_INTERVIEW,
      },
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await Promise.all([
      this.tourGuideRepository.update(tourGuideId, {
        verifyStatus:
          action === ActionResponseRegisterTourguide.ACCEPT
            ? TourguideStatus.ACTIVE
            : TourguideStatus.REJECT,
      }),
      // todo
      // this.mailService.
    ]);
    return httpResponse.RESPONSE_SUCCESS;
  }

  async getTourGuide(option: GetTourGuideDto): Promise<Response> {
    const data = await this.tourGuideRepository.getTourGuides(option);
    return {
      returnValue: data,
      ...httpResponse.GET_TOURGUIDE_SUCCESS,
    };
  }

  async getOneTourGuide(tourGuideId: number): Promise<Response> {
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tourGuideId,
        verifyStatus: TourguideStatus.ACTIVE,
      },
      relations: [
        'tours',
        'tours.rates',
        'provinces',
        'userFavorites',
        'reports',
        'orders',
      ],
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const avgStar = await this.tourGuideRepository.getAvgStar(tourGuideId);
    const numberOfOrder = tourGuide.orders.filter((order) => {
      order.status === OrderStatus.DONE;
    }).length;
    return {
      ...httpResponse.GET_TOURGUIDE_SUCCESS,
      returnValue: { ...tourGuide, ...avgStar, numberOfOrder },
    };
  }

  async updateStatusTourGuide(
    body: UpdateStatusTourGuideDto,
  ): Promise<Response> {
    const { tourGuideId, status } = body;
    if (![TourguideStatus.ACTIVE, TourguideStatus.INACTIVE].includes(status)) {
      throw new HttpException(
        httpErrors.INVALID_STATUS,
        HttpStatus.BAD_REQUEST,
      );
    }
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tourGuideId,
      },
      relations: ['orders'],
    });
    // TODO: neus tourguide có tour chưa trả tiền thì hủy và ,,,
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const tourGuideOrders = tourGuide.orders.filter((order) => {
      if (
        [
          OrderStatus.PROCESSING,
          OrderStatus.WAITING_PREPAID,
          OrderStatus.WAITING_PURCHASE,
          OrderStatus.WAITING_START,
          OrderStatus.WAITING_TOUR_GUIDE,
        ].includes(order.status)
      ) {
        return order;
      }
    });
    if (tourGuideOrders.length > 0) {
      throw new HttpException(
        httpErrors.TOURGUIDE_HAS_ORDER,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.tourGuideRepository.update(
      { id: tourGuideId },
      {
        verifyStatus: status,
      },
    );
    return httpResponse.UPDATE_STATUS_TOURGUIDE_SUCCESS;
  }

  async deleteTourGuide(tourGuideId: number): Promise<Response> {
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tourGuideId,
      },
      relations: ['orders'],
    });
    // TODO: neus tourguide có tour chưa trả tiền thì hủy và ,,,
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const tourGuideOrders = tourGuide.orders.filter((order) => {
      if (
        [
          OrderStatus.PROCESSING,
          OrderStatus.WAITING_PREPAID,
          OrderStatus.WAITING_PURCHASE,
          OrderStatus.WAITING_START,
          OrderStatus.WAITING_TOUR_GUIDE,
        ].includes(order.status)
      ) {
        return order;
      }
    });
    if (tourGuideOrders.length > 0) {
      throw new HttpException(
        httpErrors.TOURGUIDE_HAS_ORDER,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.tourGuideRepository.softDelete(tourGuide.id);
    return httpResponse.UPDATE_STATUS_TOURGUIDE_SUCCESS;
  }
}
