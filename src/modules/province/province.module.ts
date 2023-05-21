import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
  imports: [],
  providers: [ProvinceService],
  controllers: [ProvinceController],
  exports: [],
})
export class ProvinceModule {}
