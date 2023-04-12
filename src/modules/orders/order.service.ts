import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderSchedule } from 'src/models/entities/order_schedule.entity';
import { OrderScheduleRepository } from 'src/models/repositories/order-schedule.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { TourImageRepository } from 'src/models/repositories/tour-image.repository';
import { TourScheduleRepository } from 'src/models/repositories/tour-schedule.repository';
import { TourRepository } from 'src/models/repositories/tour.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { OrderTourDto } from './dtos/order-tour.dto';
import * as moment from 'moment';
import { Order } from 'src/models/entities/orders.entity';
import { GetTourOptions, OrderStatus } from 'src/shares/enum/order.enum';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { In } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly userRepository: UserRepository,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderScheduleRepository: OrderScheduleRepository,
  ) {}

  async orderTour(userId: number, body: OrderTourDto) {
    const { startDate, tourId, price, numberOfMember } = body;
    const [tour, user] = await Promise.all([
      this.tourRepository.findOne({
        where: {
          id: tourId,
        },
        relations: ['tourGuide', 'tourSchedule'],
      }),
      this.userRepository.findOne({
        where: { id: userId, verifyStatus: UserStatus.ACTIVE },
      }),
    ]);
    if (!tour) {
      throw new HttpException(httpErrors.TOUR_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (numberOfMember > tour.maxMember) {
      throw new HttpException(
        httpErrors.NUM_OF_MEMBER_INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tour.tourGuide.id,
      },
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    // TODO: add voucher
    const orderPrice =
      numberOfMember - tour.numOfFreeMember > 0
        ? price + (numberOfMember - tour.numOfFreeMember) * tour.feePerMember
        : price;
    const scheduleContent = tour.tourSchedule.map((e) => {
      return { content: e.content };
    });
    await this.orderScheduleRepository.save([...scheduleContent]);
    const orderSchedule = await Promise.all(
      scheduleContent.map((item) =>
        this.orderScheduleRepository.save({
          content: item.content,
        }),
      ),
    );

    await this.orderRepository.save({
      startDate,
      endDate: moment(new Date(startDate))
        .add(scheduleContent.length, 'days')
        .toISOString()
        .split('T')[0],
      price: orderPrice,
      paid: 0,
      size: numberOfMember,
      tourGuide,
      tour,
      user,
      orderSchedule,
      status: OrderStatus.WAITING_TOUR_GUIDE,
    });
  }

  async getOrdersByStatus(userId: number, options: GetOrdersDto) {
    const { type } = options;
    let orderStatus = [];
    switch (type) {
      case GetTourOptions.ALL:
        orderStatus = [
          ...OrderStatus.WAITING_PURCHASE,
          OrderStatus.WAITING_TOUR_GUIDE,
          OrderStatus.WAITING_START,
          OrderStatus.PROCESSING,
          OrderStatus.DONE,
          OrderStatus.REJECTED,
        ];
        break;
      case GetTourOptions.WAITING:
        orderStatus = [
          ...OrderStatus.WAITING_PURCHASE,
          OrderStatus.WAITING_TOUR_GUIDE,
        ];
        break;
      case GetTourOptions.PROCESSING:
        orderStatus = [...OrderStatus.WAITING_START, OrderStatus.PROCESSING];
        break;
      case GetTourOptions.END:
        orderStatus = [...OrderStatus.DONE, OrderStatus.REJECTED];
        break;
      default:
        break;
    }
    const orders = await this.orderRepository.find({
      where: {
        status: In(orderStatus),
        userId,
      },
    });
    if (!orders) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return orders;
  }

  async getOneOrder(userId: number, orderId: number) {
    const orders = await this.orderRepository.findOne({
      where: {
        id: orderId,
        userId,
      },
    });
    if (!orders) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return orders;
  }
}
