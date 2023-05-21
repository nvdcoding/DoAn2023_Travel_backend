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
import { Response } from 'src/shares/response/response.interface';
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { ApproveOrderDto } from './dtos/approve-order.dto';
import { CancelOrderDto } from './dtos/cancel-order.dto';
import { EndOrderDto } from './dtos/end-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { OrderTourDto } from './dtos/order-tour.dto';
import { PaidOrderDto } from './dtos/paid-order.dto';
import { PrepaidOrderDto } from './dtos/prepaid-order.dto';
import { RateOrderDto } from './dtos/rate-order.dto';
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

  @Get('/user')
  @UseGuards(UserAuthGuard)
  async getOrdersByStatus(
    @ActorID() userId: number,
    @Query() options: GetOrdersDto,
  ): Promise<Response> {
    return this.orderService.getOrdersByStatus(userId, options);
  }

  @Get('/user/:id')
  @UseGuards(UserAuthGuard)
  async userGetOneOrder(
    @ActorID() userId: number,
    @Param('id') orderId: number,
  ): Promise<Response> {
    return this.orderService.userGetOneOrder(userId, orderId);
  }

  @Put('/prepaid')
  @UseGuards(UserAuthGuard)
  async prepaidOrder(
    @Body() body: PrepaidOrderDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.orderService.userPrepaidOrder(body, userId);
  }

  @Put('/paid')
  @UseGuards(UserAuthGuard)
  async payOrder(
    @Body() body: PaidOrderDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.orderService.paidOrder(body, userId);
  }

  @Put('/start-user/:orderId')
  @UseGuards(UserAuthGuard)
  async userStartOrder(@Param('orderId') orderId: number): Promise<Response> {
    return this.orderService.startOrder(orderId, 'user');
  }

  @Put('/end-order')
  @UseGuards(UserAuthGuard)
  async endOrder(@Body() body: EndOrderDto): Promise<Response> {
    return this.orderService.endOrder(body);
  }

  @Put('/rate-order')
  @UseGuards(UserAuthGuard)
  async rateOrder(@Body() body: RateOrderDto): Promise<Response> {
    return this.orderService.rateOrder(body);
  }

  @Delete('/user')
  @UseGuards(UserAuthGuard)
  async userCancelOrder(
    @Body() body: CancelOrderDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.orderService.userCancelOrder(body, userId);
  }

  // CALL BY TOURGUIDE

  @Get('/tourguide/:id')
  @UseGuards(TourGuideAuthGuard)
  async tourGuideGetOneOrder(
    @ActorID() tourGuideId: number,
    @Param('id') orderId: number,
  ): Promise<Response> {
    return this.orderService.tourGuideGetOneOrder(tourGuideId, orderId);
  }

  @Get('/tourguide')
  @UseGuards(TourGuideAuthGuard)
  async tourGuidGetOrdersByStatus(
    @ActorID() tourGuideId: number,
    @Query() options: GetOrdersDto,
  ): Promise<Response> {
    return this.orderService.tourGuideGetOrderByStatus(tourGuideId, options);
  }

  @Put('/tourguide/approve-order')
  @UseGuards(TourGuideAuthGuard)
  async approveOrder(
    @Body() body: ApproveOrderDto,
    @ActorID() tourGuideId: number,
  ): Promise<Response> {
    return this.orderService.approveOrder(body, tourGuideId);
  }

  @Put('/start-tourguide/:orderId')
  @UseGuards(TourGuideAuthGuard)
  async tourGuideStartOrder(
    @Param('orderId') orderId: number,
  ): Promise<Response> {
    return this.orderService.startOrder(orderId, 'tourguide');
  }

  @Delete('/tourguide')
  @UseGuards(TourGuideAuthGuard)
  async tourGuideCancelOrder(
    @Body() body: CancelOrderDto,
    @ActorID() tourGuideId: number,
  ): Promise<Response> {
    return this.orderService.tourGuideCancelOrder(body, tourGuideId);
  }
}
