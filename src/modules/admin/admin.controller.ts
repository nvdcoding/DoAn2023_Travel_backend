import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { AdminService } from './admin.service';
import { ActiveAdminDto } from './dtos/active-admin.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/')
  @UseGuards(AdminAuthGuard)
  async createAccount(@Body() body: CreateAdminDto): Promise<Response> {
    return this.adminService.createAccount(body);
  }

  @Post('/active-admin')
  async activeAdmin(@Body() body: ActiveAdminDto): Promise<Response> {
    return this.adminService.activeAccount(body);
  }
}
