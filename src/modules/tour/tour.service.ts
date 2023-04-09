import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { TourImageRepository } from 'src/models/repositories/tour-image.repository';
import { TourScheduleRepository } from 'src/models/repositories/tour-schedule.repository';
import { TourRepository } from 'src/models/repositories/tour.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { TourStatus } from 'src/shares/enum/tour.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { Between, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
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
    const { name, description, basePrice, maxPrice, provinceId } = body;
    const [tour, tourGuide, province] = await Promise.all([
      this.tourRepository.findOne({ where: { name } }),
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
      status: TourStatus.INACTIVE,
    });
    return httpResponse.CREATE_TOUR_SUCCESS;
  }

  async getTours(options: GetTourDto) {
    // const tours = await this.tourRepository.fin
    const { provinceId, tourGuideId, minPrice, maxPrice } = options;
    const where = {};
    if (provinceId) {
      where[`provinceId`] = provinceId;
    }
    if (tourGuideId) {
      where[`tourGuideId`] = tourGuideId;
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
    const data = await this.tourRepository.findAndCount({
      where: {
        ...where,
        status: TourStatus.ACTIVE,
      },
      relations: ['images', 'rates'],
    });
    return BasePaginationResponseDto.convertToPaginationWithTotalPages(
      data,
      options.page || 1,
      options.limit || 10,
    );
  }
}
