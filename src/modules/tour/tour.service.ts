import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { TourImageRepository } from 'src/models/repositories/tour-image.repository';
import { TourScheduleRepository } from 'src/models/repositories/tour-schedule.repository';
import { TourRepository } from 'src/models/repositories/tour.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import {
  AdminApproveAction,
  TourStatus,
  TourTypes,
} from 'src/shares/enum/tour.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { ApproveTourDto } from './dtos/approve-tour.dto';
import { CreateTourDto } from './dtos/create-tour.dto';
import { GetTourDto } from './dtos/get-tour-dto';

@Injectable()
export class TourService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly tourScheduleRepository: TourScheduleRepository,
    private readonly tourImageRepository: TourImageRepository,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async createTour(
    body: CreateTourDto,
    tourGuideId: number,
  ): Promise<Response> {
    const { name, description, basePrice, maxPrice, provinceId, maxMember } =
      body;
    const [tour, tourGuide, province] = await Promise.all([
      this.tourRepository.findOne({
        where: { name },
      }),
      this.tourGuideRepository.findOne({ where: { id: tourGuideId } }),
      this.provinceRepository.findOne(provinceId),
    ]);
    if (tour) {
      throw new HttpException(httpErrors.TOUR_EXIST, HttpStatus.FOUND);
    }
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!province) {
      throw new HttpException(
        httpErrors.PROVINCE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const [tourSchedulesData, imagesData] = await Promise.all([
      this.tourScheduleRepository.save([...body.tourSchedules]),
      this.tourImageRepository.save([...body.tourImages]),
    ]);

    await this.tourRepository.save({
      name,
      description,
      basePrice,
      maxPrice,
      tourGuide,
      images: imagesData,
      tourSchedule: tourSchedulesData,
      status: TourStatus.ACTIVE,
      province,
      maxMember,
      tour,
    });
    return httpResponse.CREATE_TOUR_SUCCESS;
  }

  async getTours(options: GetTourDto): Promise<Response> {
    // const tours = await this.tourRepository.fin
    const { provinceId, tourGuideId, minPrice, maxPrice, types } = options;
    const tourTypesArray = types
      ?.replace(/\s/g, '')
      .split(',')
      .filter((e) => (Object.values(TourTypes) as string[]).includes(e));

    const where = {};

    if (provinceId) {
      where[`province`] = provinceId;
    }
    if (tourGuideId) {
      where[`tourGuide`] = tourGuideId;
    }
    if (minPrice && maxPrice) {
      where[`basePrice`] = Between(minPrice, maxPrice);
    }
    if (minPrice && !maxPrice) {
      where[`basePrice`] = MoreThanOrEqual(minPrice);
    }
    if (!minPrice && maxPrice) {
      where[`basePrice`] = LessThanOrEqual(maxPrice);
    }

    if (tourTypesArray && tourTypesArray.length > 0) {
      where[`type`] = In(tourTypesArray);
    }
    const data = await this.tourRepository.findAndCount({
      where: {
        ...where,
        status: TourStatus.ACTIVE,
      },
      relations: [
        'images',
        'rates',
        'tourGuide',
        'userFavorites',
        'tourSchedule',
        'province',
      ],
    });
    return {
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        data,
        options.page || 1,
        options.limit || 10,
      ),
      ...httpResponse.GET_TOUR_SUCCESS,
    };
  }

  async getTour(id: number): Promise<Response> {
    const tour = await this.tourRepository.findOne({
      where: { id, status: TourStatus.ACTIVE },
      relations: [
        'images',
        'rates',
        'tourGuide',
        'userFavorites',
        'tourSchedule',
        'province',
      ],
    });
    if (!tour) {
      throw new HttpException(httpErrors.TOUR_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return {
      ...httpResponse.GET_PROVINCE_SUCCESS,
      returnValue: tour,
    };
  }

  async getApproveList(options: GetTourDto) {
    const data = await this.tourRepository.findAndCount({
      where: {
        status: TourStatus.WAITING,
      },
      relations: ['images', 'rates', 'tourGuide', 'tourSchedule', 'province'],
    });
    return {
      ...httpResponse.GET_TOUR_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        data,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async approveTour(body: ApproveTourDto): Promise<Response> {
    const { tourId, action } = body;
    const tour = await this.tourRepository.findOne({
      where: {
        id: tourId,
        status: TourStatus.WAITING,
      },
      relations: ['tourGuide'],
    });
    if (!tour) {
      throw new HttpException(httpErrors.TOUR_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (tour.tourGuide.verifyStatus !== TourguideStatus.ACTIVE) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_ACTIVE,
        HttpStatus.BAD_REQUEST,
      );
    }
    let status: TourStatus;
    switch (action) {
      case AdminApproveAction.APPROVE:
        status = TourStatus.ACTIVE;
        break;
      case AdminApproveAction.REJECT:
        status = TourStatus.REJECTED;
        break;
      default:
        break;
    }
    await this.tourRepository.update(tourId, {
      status,
    });
    return httpResponse.CREATE_TOUR_SUCCESS;
  }
}
