import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourRepository } from './repositories/tour.repository';
import { TourGuideRepository } from './repositories/tourguide.repository';
import { UserRepository } from './repositories/user.repository';

const commonRepositories = [
  UserRepository,
  TourGuideRepository,
  TourRepository,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(commonRepositories)],
  exports: [TypeOrmModule],
})
export class DatabaseCommonModule {}
