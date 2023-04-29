import { EntityRepository, Repository } from 'typeorm';
import { Rate } from '../entities/rate.entity';

@EntityRepository(Rate)
export class RateRepository extends Repository<Rate> {}
