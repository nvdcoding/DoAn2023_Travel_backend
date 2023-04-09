import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { getProvinceDto } from './dtos/get-province.dto';
import { ProvinceService } from './province.service';

@Controller('provinces')
@ApiTags('Province')
@ApiBearerAuth()
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get('/')
  async getProvinces(@Query() query: getProvinceDto): Promise<Response> {
    return this.provinceService.getProvinces(query);
  }
}
