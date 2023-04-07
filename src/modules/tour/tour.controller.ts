import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { CreateTourDto } from './dtos/create-tour.dto';
import { GetTourDto } from './dtos/get-tour-dto';
import { TourService } from './tour.service';

@Controller('tours')
@ApiTags('Tour')
@ApiBearerAuth()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post('/')
  // HDV tạo
  async createTour(@Body() body: CreateTourDto): Promise<Response> {
    return this.tourService.createTour(body, 1);
  }

  @Get('/')
  async getTour(@Query() options: GetTourDto) {
    return this.tourService.getTours(options);
  }
}
