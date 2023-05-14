import { Module } from '@nestjs/common';
import { ProvinceController } from './report.controller';
import { ProvinceService } from './report.service';

@Module({
  imports: [],
  providers: [ProvinceService],
  controllers: [ProvinceController],
  exports: [],
})
export class ProvinceModule {}
