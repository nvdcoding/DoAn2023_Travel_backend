import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './repositories/admin.repository';
import { OrderScheduleRepository } from './repositories/order-schedule.repository';
import { OrderRepository } from './repositories/order.repository';
import { ProvinceRepository } from './repositories/province.repository';
import { TourImageRepository } from './repositories/tour-image.repository';
import { TourScheduleRepository } from './repositories/tour-schedule.repository';
import { TourRepository } from './repositories/tour.repository';
import { TourGuideRepository } from './repositories/tourguide.repository';
import { UserRepository } from './repositories/user.repository';

const commonRepositories = [
  UserRepository,
  TourGuideRepository,
  TourRepository,
  TourScheduleRepository,
  TourImageRepository,
  ProvinceRepository,
  OrderRepository,
  OrderScheduleRepository,
  AdminRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
