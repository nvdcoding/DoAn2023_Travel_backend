import { BullModule } from '@nestjs/bull';
import { CacheModule, Logger } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseCommonModule } from 'src/models/database-common';
import { redisConfig } from './configs/redis.config';

const Modules = [
  Logger,
  DatabaseCommonModule,
  BullModule.forRoot({
    redis: redisConfig,
  }),
  ConsoleModule,
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
];
export default Modules;
