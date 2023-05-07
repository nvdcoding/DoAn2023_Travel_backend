import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { Response } from 'src/shares/response/response.interface';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { CreateRequestDto } from './dtos/create-request.dto';
import { RequestService } from './request.service';

@Controller('requests')
@ApiTags('Request')
@ApiBearerAuth()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('/')
  @UseGuards(UserAuthGuard)
  async createRequest(
    @Body() body: CreateRequestDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.requestService.createRequest(body, userId);
  }

  @Get('/user')
  @UseGuards(UserAuthGuard)
  async getMyRequest(@Query() options) {}
}
