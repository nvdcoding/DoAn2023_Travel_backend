import { EntityRepository, Repository } from 'typeorm';
import { Tour } from '../entities/tour.entity';

@EntityRepository(Tour)
export class TourRepository extends Repository<Tour> {}
