import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { Response } from 'src/shares/response/response.interface';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
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

  // @Put('/active')
  // @UseGuards()

  @Get('/')
  async getTour(@Query() options: GetTourDto) {
    return this.tourService.getTours(options);
  }

  @Post('/orders')
  @UseGuards(UserAuthGuard)
  async orderTours(@UserID() userId: number, body) {
    console.log(userId);
  }
}
