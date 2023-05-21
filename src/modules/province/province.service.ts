import { HttpException, Injectable, Query } from '@nestjs/common';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { provinceData } from 'src/shares/data/province';
import { TourStatus } from 'src/shares/enum/tour.enum';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { IsNull, Like, Not } from 'typeorm';
import { getProvinceDto } from './dtos/get-province.dto';
@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async getProvinces(query: getProvinceDto): Promise<Response> {
    const keyword = query.keyword?.replace(/(%)/g, '\\$1');

    const queryBuilder = this.provinceRepository
      .createQueryBuilder('province')
      .leftJoinAndSelect('province.tours', 'tour', 'tour.status = :status', {
        status: TourStatus.ACTIVE,
      });
    if (keyword) {
      queryBuilder.where('province.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }
    const provinces = await queryBuilder.getMany();

    return {
      ...httpResponse.GET_PROVINCE_SUCCESS,
      returnValue: provinces,
    };
  }

  async getTopProvinces(): Promise<Response> {
    const queryBuilder = this.provinceRepository
      .createQueryBuilder('province')
      .leftJoinAndSelect('province.tours', 'tour', 'tour.status = :status', {
        status: TourStatus.ACTIVE,
      })
      .orderBy('province.numOfFavorites')
      .addOrderBy(`COUNT('tour.id')`, 'DESC')
      .take(5);

    const provinces = await queryBuilder.getMany();

    return {
      ...httpResponse.GET_PROVINCE_SUCCESS,
      returnValue: provinces,
    };
  }
}
