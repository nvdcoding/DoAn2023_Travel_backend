import { Injectable } from '@nestjs/common';
import { OrderScheduleRepository } from 'src/models/repositories/order-schedule.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { TourRepository } from 'src/models/repositories/tour.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';

@Injectable()
export class VoucherService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly userRepository: UserRepository,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderScheduleRepository: OrderScheduleRepository,
  ) {}
}
