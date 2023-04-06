import { BullModule } from '@nestjs/bull';
import { CacheModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseCommonModule } from 'src/models/database-common';
import { redisConfig } from './configs/redis.config';
import { Admin } from './models/entities/admin.entity';
import { Comment } from './models/entities/comment.entity';
import { Order } from './models/entities/orders.entity';
import { OrderSchedule } from './models/entities/order_schedule.entity';
import { Province } from './models/entities/province.entity';
import { User } from './models/entities/user.entity';
import { UserFavorite } from './models/entities/user_favorite.entity';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { TourModule } from './modules/tour/tour.module';

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
];
export default Modules;
