import { Module } from '@nestjs/common';
import { GenDataService } from './gen-data.service';
import { GenDataController } from './gen-date.controller';

@Module({
  imports: [],
  providers: [GenDataService],
  controllers: [GenDataController],
  exports: [],
})
export class GenDataModule {}
