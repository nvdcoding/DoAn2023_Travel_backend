import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { GetVoucherDto } from './dtos/get-voucher.dto';
import { VoucherService } from './vourcher.service';

@Controller('vourchers')
@ApiTags('Voucher')
@ApiBearerAuth()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}
  @Post('/')
  @UseGuards(AdminModAuthGuard)
  async createVoucher(@Body() body: CreateVoucherDto): Promise<Response> {
    return this.voucherService.createVoucher(body);
  }

  @Get('/')
  @UseGuards(UserAuthGuard)
  async getAllVoucher(@Query() options: GetVoucherDto): Promise<Response> {
    return this.voucherService.getAllVoucher(options);
  }
}
