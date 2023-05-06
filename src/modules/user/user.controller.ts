import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { AdminChangeStatusUserDto } from './dtos/change-user-status.dto';
import { AdminGetUsersDto } from './dtos/get-list-user.dto';
import { TransferDto } from './dtos/transfer.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AdminModAuthGuard)
  async getUsers(@Query() options: AdminGetUsersDto): Promise<Response> {
    return this.userService.getListUser(options);
  }

  @Get('/post')
  @UseGuards(UserAuthGuard)
  async getUserPost(
    @Query() options: BasePaginationRequestDto,
    @ActorID() actorId: number,
  ): Promise<Response> {
    return this.userService.getUserPost(options, actorId);
  }

  @Put('/')
  @UseGuards(AdminModAuthGuard)
  async changeStatusUser(
    @Body() body: AdminChangeStatusUserDto,
  ): Promise<Response> {
    return this.userService.changeUserStatus(body);
  }

  @Delete('/:id')
  @UseGuards(AdminModAuthGuard)
  async deleteUser(@Param('id') userId: number): Promise<Response> {
    return this.userService.deleteUser(userId);
  }

  @Post('/deposit')
  @UseGuards(UserAuthGuard)
  async genUrlPay(
    @Body() body: TransferDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.userService.genUrlPay(body, userId);
  }

  @Get('/ipn')
  async webhookIPN(@Query() query) {
    return this.userService.IPNUrl(query);
  }
}
