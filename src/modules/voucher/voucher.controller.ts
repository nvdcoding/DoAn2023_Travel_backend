import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { OrderTourDto } from '../orders/dtos/order-tour.dto';

@Controller('vourchers')
@ApiTags('Voucher')
@ApiBearerAuth()
export class VoucherController {
  constructor() {}
  @Post('/')
  @UseGuards(UserAuthGuard)
  async createVoucher(@Body() body: OrderTourDto) {
    // return this.orderService.orderTour(userId, body);
  }
}
