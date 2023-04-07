import { Module } from '@nestjs/common';
import { TourGuideController } from './tour-guide.controller';
import { TourGuideService } from './tour-guide.service';

@Module({
  imports: [],
  providers: [TourGuideService],
  controllers: [TourGuideController],
  exports: [],
})
export class TourGuideModule {}
