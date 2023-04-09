import { EntityRepository, Repository } from 'typeorm';
import { OrderSchedule } from '../entities/order_schedule.entity';
import { TourSchedule } from '../entities/tour_schedule.entity';

@EntityRepository(OrderSchedule)
export class OrderScheduleRepository extends Repository<OrderSchedule> {}
