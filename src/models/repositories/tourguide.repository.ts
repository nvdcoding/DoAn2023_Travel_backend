import { EntityRepository, Repository } from 'typeorm';
import { TourGuide } from '../entities/tourguide.entity';

@EntityRepository(TourGuide)
export class TourGuideRepository extends Repository<TourGuide> {}
