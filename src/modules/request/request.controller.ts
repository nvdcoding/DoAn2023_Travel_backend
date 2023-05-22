import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorRoleDecorator } from 'src/shares/decorators/get-role.decorator';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { Response } from 'src/shares/response/response.interface';
import { IsLoginGuard } from '../auth/guards/is-login.guard';
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { CreateRequestDto } from './dtos/create-request.dto';
import { GetUserRequestDto } from './dtos/get-request.dto';
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

  @Delete('/:id')
  @UseGuards(TourGuideAuthGuard)
  async deleteRequest(@Param('id') requestId): Promise<Response> {
    return this.requestService.deleteRequest(requestId);
  }

  @Get('/user')
  @UseGuards(UserAuthGuard)
  async getMyRequest(
    @Query() options: GetUserRequestDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.requestService.getMyRequest(options, userId);
  }

  @Get('/tourguide')
  @UseGuards(TourGuideAuthGuard)
  async getListRequest(
    @Query() options: BasePaginationRequestDto,
    @ActorID() tourGuideId: number,
  ): Promise<Response> {
    return this.requestService.tourGuideGetRequest(options, tourGuideId);
  }

  @Get('/get/:requestId')
  @UseGuards(IsLoginGuard)
  async getOneRequest(
    @Param('requestId') requestId: number,
    @ActorID() actorId: number,
    @ActorRoleDecorator() role: ActorRole,
  ): Promise<Response> {
    return this.requestService.getOneRequest(requestId, actorId, role);
  }

  @Delete('/user/:id')
  @UseGuards(UserAuthGuard)
  async deleteMyRequest(
    @Param('id') requestId,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.requestService.deleteMyRequest(requestId, userId);
  }
}
