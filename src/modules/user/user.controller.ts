import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { AdminChangeStatusUserDto } from './dtos/change-user-status.dto';
import { AdminGetUSersDto } from './dtos/get-list-user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AdminModAuthGuard)
  async getUsers(@Query() options: AdminGetUSersDto): Promise<Response> {
    return this.userService.getListUser(options);
  }

  @Put('/')
  @UseGuards(AdminModAuthGuard)
  async changeStatusUser(
    @Body() body: AdminChangeStatusUserDto,
  ): Promise<Response> {
    return this.userService.changeUserStatus(body);
  }
}
