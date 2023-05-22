import { BullModule } from '@nestjs/bull';
import { CacheModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseCommonModule } from 'src/models/database-common';
import { redisConfig } from './configs/redis.config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { CommentModule } from './modules/comment/comment.module';
import { GenDataModule } from './modules/gen-data/gen-data.modules';
import { MailModule } from './modules/mail/mail.module';
import { OrderModule } from './modules/orders/order.module';
import { PostModule } from './modules/post/post.module';
import { ProvinceModule } from './modules/province/province.module';
import { ReportModule } from './modules/report/report.module';
import { RequestModule } from './modules/request/request.module';
import { TourModule } from './modules/tour/tour.module';
import { TourGuideModule } from './modules/tourguide/tour-guide.module';
import { TransactionModule } from './modules/transactions/transaction.modules';
import { UserModule } from './modules/user/user.module';
import { VoucherModule } from './modules/voucher/voucher.module';

const Modules = [
  Logger,
  TypeOrmModule.forRoot(),
  DatabaseCommonModule,
  ConfigModule.forRoot(),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  BullModule.forRoot({
    redis: redisConfig,
  }),
  MailModule,
  ConsoleModule,
  AuthModule,
  TourModule,
  GenDataModule,
  AdminModule,
  UserModule,
  ProvinceModule,
  OrderModule,
  VoucherModule,
  TourGuideModule,
  PostModule,
  ChatModule,
  RequestModule,
  CommentModule,
  TransactionModule,
  ReportModule,
  ScheduleModule.forRoot(),
];
export default Modules;
