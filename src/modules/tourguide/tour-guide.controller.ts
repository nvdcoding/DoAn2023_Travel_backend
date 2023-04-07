import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
}
