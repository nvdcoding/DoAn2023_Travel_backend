import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ActorID,
  OptionalActorID,
} from 'src/shares/decorators/get-user-id.decorator';
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
  // @UseGuards(UserAuthGuard)
  async getAllVoucher(
    @Query() options: GetVoucherDto,
    @OptionalActorID() userId: number,
  ): Promise<Response> {
    console.log(userId);
    return this.voucherService.getAllVoucher(options, userId);
  }

  @Put('/:voucherId')
  @UseGuards(UserAuthGuard)
  async claimVoucher(
    @ActorID() userId: number,
    @Param('voucherId') voucherId: number,
  ): Promise<Response> {
    return this.voucherService.claimVoucher(voucherId, userId);
  }

  @Get('/available')
  @UseGuards(UserAuthGuard)
  async getAvailableVoucher(@ActorID() userId: number): Promise<Response> {
    return this.voucherService.getAllAvailableVouchersForUser(userId);
  }
}
