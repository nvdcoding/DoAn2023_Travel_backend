import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { GenAdminDto } from './dtos/gen-admin.dto';

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

  @Post('/admin')
  // HDV tạo
  async getAdmin(@Body() body: GenAdminDto) {
    return this.genDataService.genAdminAccount(body);
  }
}
