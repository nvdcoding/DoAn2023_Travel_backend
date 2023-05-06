import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard';
import {
  AdminGetTourGuideDto,
  GetTourGuideDto,
} from './dtos/get-tour-guide.dto';
import { ResponseInterviewTourguideDto } from './dtos/response-interview.dto';
import { ResponseRegisterTourguideDto } from './dtos/response-registation-tourguide.dto';
import { UpdateStatusTourGuideDto } from './dtos/update-status-tourguide.dto';
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
  @Get('/post')
  @UseGuards(TourGuideAuthGuard)
  async getTourGuidePost(
    @Query() options: BasePaginationRequestDto,
    @ActorID() tourGuideId: number,
  ): Promise<Response> {
    return this.tourGuideService.getTourGuidePost(options, tourGuideId);
  }

  @Get('/admin')
  @UseGuards(AdminModAuthGuard)
  async getTourGuideByStatus(
    @Query() options: AdminGetTourGuideDto,
  ): Promise<Response> {
    return this.tourGuideService.getTourGuidesByStatusAndKeyword(options);
  }

  @Put('/')
  @UseGuards(AdminModAuthGuard)
  async updateTourguideStatus(
    @Body() body: UpdateStatusTourGuideDto,
  ): Promise<Response> {
    return this.tourGuideService.updateStatusTourGuide(body);
  }

  @Delete('/:id')
  @UseGuards(AdminModAuthGuard)
  async deleteTourguide(@Param('id') id: number): Promise<Response> {
    return this.tourGuideService.deleteTourGuide(id);
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
