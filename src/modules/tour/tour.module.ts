import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [],
  providers: [TourService],
  controllers: [TourController],
  exports: [],
})
export class TourModule {}
