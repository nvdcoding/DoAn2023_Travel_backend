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
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { Response } from 'src/shares/response/response.interface';
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { ApproveOrderDto } from './dtos/approve-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { OrderTourDto } from './dtos/order-tour.dto';
import { PaidOrderDto } from './dtos/paid-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('/')
  @UseGuards(UserAuthGuard)
  async orderTours(
    @ActorID() userId: number,
    @Body() body: OrderTourDto,
  ): Promise<Response> {
    return this.orderService.orderTour(userId, body);
  }

  @Get('/')
  @UseGuards(UserAuthGuard)
  async getOrdersByStatus(
    @ActorID() userId: number,
    @Query() options: GetOrdersDto,
  ): Promise<Response> {
    return this.orderService.getOrdersByStatus(userId, options);
  }

  @Get('/:id')
  @UseGuards(UserAuthGuard)
  async getOneOrder(
    @ActorID() userId: number,
    @Param('id') orderId: number,
  ): Promise<Response> {
    return this.orderService.getOneOrder(userId, orderId);
  }

  @Get('/')
  @UseGuards(TourGuideAuthGuard)
  async tourGuidGetOrdersByStatus(
    @ActorID() tourGuideId: number,
    @Query() options: GetOrdersDto,
  ): Promise<Response> {
    return this.orderService.tourGuideGetOrderByStatus(tourGuideId, options);
  }

  @Put('/tour-guide/approve-order')
  @UseGuards()
  async approveOrder(
    @Body() body: ApproveOrderDto,
    @ActorID() tourGuideId: number,
  ): Promise<Response> {
    return this.orderService.approveOrder(body, tourGuideId);
  }
  @Put('/paid')
  @UseGuards(UserAuthGuard)
  async payOrder(@Body() body: PaidOrderDto): Promise<void> {}
}
