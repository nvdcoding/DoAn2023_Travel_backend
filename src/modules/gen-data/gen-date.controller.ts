import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';

import { GenDataService } from './gen-data.service';

@Controller('gen-data')
@ApiTags('Data')
@ApiBearerAuth()
export class GenDataController {
  constructor(private readonly genDataService: GenDataService) {}

  @Post('/provinces')
  // HDV tạo
  async genProvinces() {
    return this.genDataService.GenProvince();
  }
}
