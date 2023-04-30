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
import { AdminGetTourGuideDto } from './dtos/get-tour-guide.dto';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { ResponseRegisterTourguideDto } from './dtos/response-registation-tourguide.dto';
import { httpErrors } from 'src/shares/exceptions';
import { MailService } from '../mail/mail.service';
import { ResponseInterviewTourguideDto } from './dtos/response-interview.dto';

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

    const where = {
      verifyStatus: status,
    };
    if (keyword) {
      const keywordLike = `%${keyword}%`;
      where['email'] = Like(keywordLike);
      where['OR'] = [
        { email: Like(keywordLike) },
        { username: Like(keywordLike) },
        { name: Like(keywordLike) },
        { id: Like(keywordLike) },
      ];
    }

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

  async getTourGuide(): Promise<void> {}
}
