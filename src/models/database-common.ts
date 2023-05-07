import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from './repositories/admin.repository';
import { ChatRepository } from './repositories/chat.repository';
import { OrderScheduleRepository } from './repositories/order-schedule.repository';
import { OrderRepository } from './repositories/order.repository';
import { PermissionRepository } from './repositories/permission.repository';
import { PostRepository } from './repositories/post.repository';
import { ProvinceRepository } from './repositories/province.repository';
import { RateRepository } from './repositories/rate.repository';
import { UserRequestRepository } from './repositories/request.repository';
import { SystemRepository } from './repositories/system.repository';
import { TourImageRepository } from './repositories/tour-image.repository';
import { TourScheduleRepository } from './repositories/tour-schedule.repository';
import { TourRepository } from './repositories/tour.repository';
import { TourGuideRepository } from './repositories/tourguide.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { UserVoucherRepository } from './repositories/user-voucher.repository';
import { UserRepository } from './repositories/user.repository';
import { VoucherRepository } from './repositories/voucher.repository';

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
  VoucherRepository,
  UserVoucherRepository,
  RateRepository,
  TransactionRepository,
  SystemRepository,
  PermissionRepository,
  PostRepository,
  ChatRepository,
  UserRequestRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
