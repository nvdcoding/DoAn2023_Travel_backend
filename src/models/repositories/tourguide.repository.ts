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
}
