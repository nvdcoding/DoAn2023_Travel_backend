import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import {
  AdminGetTourGuideDto,
  GetTourGuideDto,
} from './dtos/get-tour-guide.dto';
import { ResponseInterviewTourguideDto } from './dtos/response-interview.dto';
import { ResponseRegisterTourguideDto } from './dtos/response-registation-tourguide.dto';
import { TourGuideService } from './tour-guide.service';

@Controller('tour-guide')
@ApiTags('Tour Guide')
@ApiBearerAuth()
export class TourGuideController {
  constructor(private readonly tourGuideService: TourGuideService) {}

  // @Post('/')
  // // HDV tạo
  // async createTour(@Body() body: CreateTourDto): Promise<Response> {
  //   return this.tourService.createTour(body);
  // }
  @Get('/admin')
  @UseGuards(AdminModAuthGuard)
  async getTourGuideByStatus(
    @Query() options: AdminGetTourGuideDto,
  ): Promise<Response> {
    return this.tourGuideService.getTourGuidesByStatusAndKeyword(options);
  }

  @Put('/response-registation')
  @UseGuards(AdminModAuthGuard)
  async responseRegistationRequest(
    @Body() body: ResponseRegisterTourguideDto,
  ): Promise<Response> {
    return this.tourGuideService.responseRegistationTourGuide(body);
  }

  @Put('/response-interview')
  @UseGuards(AdminModAuthGuard)
  async responseInterview(
    @Body() body: ResponseInterviewTourguideDto,
  ): Promise<Response> {
    return this.tourGuideService.responseInterview(body);
  }

  @Get('/')
  async getTourGuide(@Query() options: GetTourGuideDto): Promise<Response> {
    return this.tourGuideService.getTourGuide(options);
  }

  @Get('/guest/:id')
  async getOneTourGuide(@Param('id') id: number): Promise<Response> {
    return this.tourGuideService.getOneTourGuide(id);
  }
}
