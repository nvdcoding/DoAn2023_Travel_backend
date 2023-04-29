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
import { IsLoginGuard } from '../auth/guards/is-login.guard';
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { ApproveOrderDto } from './dtos/approve-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { OrderTourDto } from './dtos/order-tour.dto';
import { PaidOrderDto } from './dtos/paid-order.dto';
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

  @Get('/')
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

  @Get('/tourguide/:id')
  @UseGuards(TourGuideAuthGuard)
  async tourGuideGetOneOrder(
    @ActorID() tourGuideId: number,
    @Param('id') orderId: number,
  ): Promise<Response> {
    return this.orderService.tourGuideGetOneOrder(tourGuideId, orderId);
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

  @Put('/start-tourguide/:orderId')
  @UseGuards(UserAuthGuard)
  async tourGuideStartOrder(
    @Param('orderId') orderId: number,
  ): Promise<Response> {
    return this.orderService.startOrder(orderId, 'tourguide');
  }

  @Put('/end-order/')
  @UseGuards(UserAuthGuard)
  async endOrder(@Body() body: RateOrderDto): Promise<Response> {
    return this.orderService.endOrder(body);
  }

  // @Delete('/del-user/:orderId')@para
  // @UseGuards(UserAuthGuard)
  // async userCancelOrder(@Param('orderId') orderId: number) {
  //   return this.orderService.startOrder(orderId, 'tourguide');
  // }
}
