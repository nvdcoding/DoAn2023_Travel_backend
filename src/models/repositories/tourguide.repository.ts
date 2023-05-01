import { GetTourGuideDto } from 'src/modules/tourguide/dtos/get-tour-guide.dto';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { Direction, OrderStatus } from 'src/shares/enum/order.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { EntityRepository, Repository } from 'typeorm';
import { TourGuide } from '../entities/tourguide.entity';

@EntityRepository(TourGuide)
export class TourGuideRepository extends Repository<TourGuide> {
  async getTourGuidesByStatusAndKeyword(
    keyword: string,
    status: TourguideStatus,
    page: number,
    limit: number,
  ) {
    const queryBuilder = this.createQueryBuilder('tourGuide');

    if (keyword) {
      const keywordLike = `%${keyword}%`;
      queryBuilder
        .where('tourGuide.email LIKE :keyword')
        .orWhere('tourGuide.username LIKE :keyword')
        .orWhere('tourGuide.name LIKE :keyword')
        .orWhere('tourGuide.id LIKE :keyword')
        .setParameters({ keyword: keywordLike });
    }

    queryBuilder
      .andWhere('tourGuide.verifyStatus = :status', { status })
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }

  async getTourGuides(getTourGuideDto: GetTourGuideDto) {
    const {
      limit,
      page,
      provinces,
      gender,
      keyword,
      totalTourDirection,
      totalFavorite,
      totalTourCanceleds,
    } = getTourGuideDto;

    const query = this.createQueryBuilder('tourguide')
      .leftJoinAndSelect('tourguide.provinces', 'province')
      .leftJoinAndSelect(
        'user_favorite',
        'favorite',
        'favorite.tourGuideId = tourguide.id',
      )
      .leftJoinAndSelect(
        'tourguide.orders',
        'orders',
        'orders.status = :status',
        {
          status: '6',
        },
      )
      .select([
        'tourguide.id',
        'tourguide.username',
        'tourguide.bio',
        'tourguide.email',
        'tourguide.phone',
        'province.name',
        'tourguide.gender',
      ])
      // .andWhere('tourguide.gender = :gender', { gender })
      // .andWhere('tourguide.status = :status', {
      //   status: TourguideStatus.ACTIVE,
      // })
      .groupBy('tourguide.id');

    if (provinces) {
      query.andWhere('province.id = :id', { id: provinces });
    }

    if (keyword) {
      query.andWhere(
        '(tourguide.firstName LIKE :keyword OR tourguide.lastName LIKE :keyword OR tourguide.email LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (totalTourDirection) {
      if (totalTourDirection === Direction.DESC) {
        query.orderBy('tourguide.totalTour', Direction.DESC);
      } else {
        query.orderBy('tourguide.totalTour', Direction.ASC);
      }
    }

    if (totalFavorite) {
      if (totalFavorite === Direction.DESC) {
        query.orderBy('tourguide.totalFavorite', Direction.DESC);
      } else {
        query.orderBy('tourguide.totalFavorite', Direction.ASC);
      }
    }

    if (totalTourCanceleds) {
      if (totalTourCanceleds === Direction.DESC) {
        query.orderBy('tourguide.totalTourCanceleds', Direction.DESC);
      } else {
        query.orderBy('tourguide.totalTourCanceleds', Direction.ASC);
      }
    }
    const data = await query.getManyAndCount();
    return BasePaginationResponseDto.convertToPaginationWithTotalPages(
      data,
      page || 1,
      limit || 10,
    );
  }
}
