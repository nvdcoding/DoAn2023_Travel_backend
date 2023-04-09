import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { OrderTourDto } from './dtos/order-tour.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('/orders')
  @UseGuards(UserAuthGuard)
  async orderTours(@UserID() userId: number, @Body() body: OrderTourDto) {
    return this.orderService.orderTour(userId, body);
  }
}
