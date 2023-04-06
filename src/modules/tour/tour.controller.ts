import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TourRepository } from 'src/models/repositories/tour.repository';

@Controller('tours')
@ApiTags('Tour')
@ApiBearerAuth()
export class TourController {
  constructor(private readonly tourRepository: TourRepository) {}

  @Post('/register')
  async register(@Body() body: RegisterDto): Promise<Response> {
    // return this.authService.register(body);
  }
}
