import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { ApproveTourDto } from './dtos/approve-tour.dto';
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

  @Get('/:id')
  async getOneTour(@Param('id') id: number) {
    return this.tourService.getTour(id);
  }

  @Get('/approve-list')
  @UseGuards(AdminModAuthGuard)
  async getApproveList(@Query() options: GetTourDto) {
    return this.tourService.getApproveList(options);
  }

  @Put('/')
  @UseGuards(AdminModAuthGuard)
  async approveTour(@Body() body: ApproveTourDto): Promise<Response> {
    return this.tourService.approveTour(body);
  }
}
