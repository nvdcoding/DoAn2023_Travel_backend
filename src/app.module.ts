import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Modules from './modules';
import { CronTask } from './modules/cronjob/cronjob.task';

@Module({
  imports: [...Modules],
  controllers: [AppController],
  providers: [AppService, CronTask],
})
export class AppModule {}
