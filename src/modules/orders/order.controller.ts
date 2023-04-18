import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { Response } from 'src/shares/response/response.interface';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { OrderTourDto } from './dtos/order-tour.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('/')
  @UseGuards(UserAuthGuard)
  async orderTours(
    @UserID() userId: number,
    @Body() body: OrderTourDto,
  ): Promise<Response> {
    return this.orderService.orderTour(userId, body);
  }

  @Get('/')
  @UseGuards(UserAuthGuard)
  async getOrdersByStatus(
    @UserID() userId: number,
    @Query() options: GetOrdersDto,
  ): Promise<Response> {
    return this.orderService.getOrdersByStatus(userId, options);
  }

  @Get('/:id')
  @UseGuards(UserAuthGuard)
  async getOneOrder(
    @UserID() userId: number,
    @Param('id') orderId: number,
  ): Promise<Response> {
    return this.orderService.getOneOrder(userId, orderId);
  }
}
