import { EntityRepository, Repository } from 'typeorm';
import { TourSchedule } from '../entities/tour_schedule.entity';

@EntityRepository(TourSchedule)
export class TourScheduleRepository extends Repository<TourSchedule> {}
