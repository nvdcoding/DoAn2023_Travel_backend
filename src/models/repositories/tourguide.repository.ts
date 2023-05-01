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
      .leftJoinAndSelect('tourguide.userFavorites', 'userFavorites')
      .leftJoinAndSelect(
        'tourguide.orders',
        'orders',
        'orders.status = :status AND orders.tourGuideId = tourguide.id',
        {
          status: OrderStatus.DONE,
        },
      )
      .select([
        'tourguide.id',
        'tourguide.username',
        'tourguide.bio',
        'tourguide.email',
        'tourguide.phone',
        'tourguide.name',
        'province.name',
        'tourguide.gender',
        'COUNT(DISTINCT orders.id) AS totalTour',
        'COUNT(DISTINCT userFavorites.id) AS totalFavorite',
      ])
      .andWhere('tourguide.gender = :gender', { gender })
      .andWhere('tourguide.status = "ACTIVE"')
      .groupBy('tourguide.id');

    if (provinces) {
      query.andWhere('province.id = :id', { id: provinces });
    }

    if (keyword) {
      query.andWhere(
        '(tourguide.username LIKE :keyword OR tourguide.name LIKE :keyword OR tourguide.email LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (totalTourDirection && !totalFavorite) {
      if (totalTourDirection === Direction.DESC) {
        query.orderBy('totalTour', Direction.DESC);
      } else {
        query.orderBy('totalTour', Direction.ASC);
      }
    }

    if (totalFavorite && !totalTourDirection) {
      if (totalFavorite === Direction.DESC) {
        query.orderBy('totalFavorite', Direction.DESC);
      } else {
        query.orderBy('totalFavorite', Direction.ASC);
      }
    }
    query.orderBy('tourguide.totalTourCanceleds', Direction.ASC);
    const data = await query.getManyAndCount();

    return BasePaginationResponseDto.convertToPaginationWithTotalPages(
      data,
      page || 1,
      limit || 10,
    );
  }
}
