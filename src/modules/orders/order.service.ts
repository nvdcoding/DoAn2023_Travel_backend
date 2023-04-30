import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OrderScheduleRepository } from 'src/models/repositories/order-schedule.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { TourRepository } from 'src/models/repositories/tour.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { OrderTourDto } from './dtos/order-tour.dto';
import * as moment from 'moment';
import {
  ActionApproveOrder,
  GetTourOptions,
  OrderStatus,
} from 'src/shares/enum/order.enum';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { In, Not } from 'typeorm';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { ApproveOrderDto } from './dtos/approve-order.dto';
import { MailService } from '../mail/mail.service';
import { PaidOrderDto } from './dtos/paid-order.dto';
import { RateOrderDto } from './dtos/rate-order.dto';
import { RateRepository } from 'src/models/repositories/rate.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import {
  TransactionStatus,
  TransactionType,
} from 'src/shares/enum/transaction.enum';
import { SystemRepository } from 'src/models/repositories/system.repository';
import { CancelOrderDto } from './dtos/cancel-order.dto';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { PrepaidOrderDto } from './dtos/prepaid-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly tourRepository: TourRepository,
    private readonly userRepository: UserRepository,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderScheduleRepository: OrderScheduleRepository,
    private readonly mailService: MailService,
    private readonly rateRepository: RateRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly systemRepository: SystemRepository,
  ) {}

  async orderTour(userId: number, body: OrderTourDto): Promise<Response> {
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

    await Promise.all([
      this.orderRepository.save({
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
      }),
    ]);
    return httpResponse.GET_ORDER_SUCCESS;
  }

  async getOrdersByStatus(
    userId: number,
    options: GetOrdersDto,
  ): Promise<Response> {
    const { type } = options;
    let orderStatus = [];
    switch (type) {
      case GetTourOptions.ALL:
        orderStatus = [
          ...OrderStatus.WAITING_PURCHASE,
          OrderStatus.WAITING_PREPAID,
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
          OrderStatus.WAITING_PREPAID,
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
    const user = await this.userRepository.findOne(userId);
    const orders = await this.orderRepository.find({
      where: {
        status: In(orderStatus),
        user,
      },
      relations: ['tour', 'orderSchedule', 'tourGuide'],
    });
    if (!orders) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { ...httpResponse.GET_ORDER_SUCCESS, returnValue: orders };
  }

  async tourGuideGetOrderByStatus(tourGuideId: number, options: GetOrdersDto) {
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
    const tourGuide = await this.tourGuideRepository.findOne(tourGuideId);
    const orders = await this.orderRepository.find({
      where: {
        status: In(orderStatus),
        tourGuide,
      },
      relations: ['tour', 'orderSchedule', 'tourGuide'],
    });
    if (!orders) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { ...httpResponse.GET_ORDER_SUCCESS, returnValue: orders };
  }

  async userGetOneOrder(userId: number, orderId: number): Promise<Response> {
    const user = await this.userRepository.findOne({
      where: { id: userId, verifyStatus: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const orders = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user,
      },
      relations: ['tourGuide', 'userVoucher', 'tour', 'user', 'orderSchedule'],
    });
    if (!orders) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { ...httpResponse.GET_ORDER_SUCCESS, returnValue: orders };
  }

  async tourGuideGetOneOrder(
    tourguideId: number,
    orderId: number,
  ): Promise<Response> {
    const tourGuide = await this.tourGuideRepository.findOne({
      where: { id: tourguideId, verifyStatus: TourguideStatus.ACTIVE },
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const orders = await this.orderRepository.findOne({
      where: {
        id: orderId,
        tourGuide,
      },
      relations: ['tourGuide', 'userVoucher', 'tour', 'user', 'orderSchedule'],
    });
    if (!orders) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return { ...httpResponse.GET_ORDER_SUCCESS, returnValue: orders };
  }

  async approveOrder(body: ApproveOrderDto, tourguideId: number) {
    const [order, system] = await Promise.all([
      this.orderRepository.findOne({
        where: {
          id: body.orderId,
          status: OrderStatus.WAITING_TOUR_GUIDE,
        },
        relations: ['user', 'tourGuide'],
      }),
      this.systemRepository.findOne(),
    ]);
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.checkTourguideAvailable(
      tourguideId,
      `${order.startDate}`,
      `${order.endDate}`,
    );
    if (
      +order.tourGuide.availableBalance <
      +(system.tourGuidePrepaidOrder / 100) * order.price
    ) {
      throw new HttpException(
        httpErrors.ORDER_PREPAID_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const task =
      body.action === ActionApproveOrder.ACCEPT
        ? this.mailService.sendAcceptOrderMail({
            email: order.user.email,
            tourGuideName: order.tourGuide.name,
            username: order.user.username,
            action: body.action,
          })
        : this.mailService.sendRejectOrderMail({
            email: order.user.email,
            tourGuideName: order.tourGuide.name,
            username: order.user.username,
            action: body.action,
          });
    if (body.action === ActionApproveOrder.ACCEPT) {
      await this.tourGuideRepository.update(
        { id: order.tourGuide.id },
        {
          availableBalance:
            order.tourGuide.availableBalance -
            order.price * (system.tourGuidePrepaidOrder / 100),
          balance:
            order.tourGuide.balance -
            order.price * (system.tourGuidePrepaidOrder / 100),
        },
      );
    }
    await Promise.all([
      this.orderRepository.update(body.orderId, {
        status:
          body.action === ActionApproveOrder.ACCEPT
            ? OrderStatus.WAITING_PREPAID
            : OrderStatus.REJECTED,
        tourGuideDeposit:
          body.action === ActionApproveOrder.ACCEPT
            ? order.price * (system.tourGuidePrepaidOrder / 100)
            : null,
        approveTime: moment(new Date()).toISOString().split('T')[0],
      }),
      task,
    ]);
    return httpResponse.APPROVE_TOUR_SUCCESS;
  }

  private async checkTourguideAvailable(
    tourGuideId: number,
    startDateString: string,
    endDateString: string,
  ) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const orders = await this.orderRepository.find({
      where: {
        tourGuide: { id: tourGuideId },
        status: In([
          OrderStatus.PROCESSING,
          OrderStatus.WAITING_PURCHASE,
          OrderStatus.WAITING_START,
        ]),
      },
    });

    for (const order of orders) {
      const orderStartDate = new Date(order.startDate);
      const orderEndDate = new Date(order.endDate);

      if (
        (startDate >= orderStartDate && startDate <= orderEndDate) ||
        (endDate >= orderStartDate && endDate <= orderEndDate)
      ) {
        throw new HttpException(
          {
            message: `Tour guide is not available from ${startDateString} to ${endDateString}`,
            code: `ERR_ORDER_003`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async paidOrder(body: PaidOrderDto, userId: number): Promise<Response> {
    const { orderId, amount } = body;
    const [order, user, system] = await Promise.all([
      this.orderRepository.findOne({
        where: {
          id: orderId,
          status: OrderStatus.WAITING_PURCHASE,
        },
      }),
      this.userRepository.findOne({
        where: {
          id: userId,
          verifyStatus: UserStatus.ACTIVE,
        },
      }),
      this.systemRepository.findOne(),
    ]);
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (amount > +user.availableBalance || amount > +user.balance) {
      throw new HttpException(
        httpErrors.USER_INSUFFICIENT_BALANCE,
        HttpStatus.NOT_FOUND,
      );
    }
    if (amount + order.paid > order.price) {
      throw new HttpException(
        httpErrors.ORDER_PAID_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }
    await Promise.all([
      this.orderRepository.update(order.id, {
        paid: order.paid + amount,
        status:
          order.paid + amount === order.price
            ? OrderStatus.WAITING_START
            : OrderStatus.WAITING_PURCHASE,
      }),
      this.userRepository.update(user.id, {
        availableBalance: +user.availableBalance - amount,
        balance: +user.availableBalance - amount,
      }),

      this.systemRepository.update(system.id, {
        balance: system.balance + amount,
      }),
    ]);
    //TODO: update send mail, send noti to hdv,
    await this.transactionRepository.save([
      {
        type: TransactionType.USER_PAY_ORDER,
        user,
        status: TransactionStatus.SUCCESS,
        amount,
      },
      {
        type: TransactionType.SYSTEM_USER_PAYORDER,
        user: null,
        amount,
        status: TransactionStatus.SUCCESS,
      },
    ]);
    return httpResponse.PAID_ORDER_SUCCESS;
  }

  async startOrder(orderId: number, actor: string): Promise<Response> {
    const today = new Date().toISOString().slice(0, 10); // get today's date in ISO format
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        status: OrderStatus.WAITING_START,
        startDate: today,
      },
    });
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    switch (actor) {
      case 'tourguide':
        await this.orderRepository.update(order.id, {
          tourGuideStart: true,
          status: order.userStart
            ? OrderStatus.PROCESSING
            : OrderStatus.WAITING_START,
        });
        break;
      case 'user':
        await this.orderRepository.update(order.id, {
          userStart: true,
          status: order.tourGuideStart
            ? OrderStatus.PROCESSING
            : OrderStatus.WAITING_START,
        });
      default:
        break;
    }
    return httpResponse.START_ORDER_SUCCESS;
  }

  async endOrder(body: RateOrderDto) {
    const { content, orderId, image, star } = body;
    const [order, system] = await Promise.all([
      this.orderRepository.findOne({
        where: {
          id: orderId,
          status: OrderStatus.PROCESSING,
        },
        relations: ['tour', 'tourGuide'],
      }),
      this.systemRepository.findOne(),
    ]);
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    // check if
    const endDate = moment(order.endDate);
    const now = moment();
    const endDatePlus7Days = moment(endDate).add(7, 'days');
    if (!now.isBetween(endDate, endDatePlus7Days)) {
      throw new HttpException(
        httpErrors.ORDER_DATE_NOT_VALID,
        HttpStatus.NOT_FOUND,
      );
    }
    if (star) {
      await this.rateRepository.save({
        star,
        order,
        tour: order.tour,
        content: content ? content : null,
        image: image ? image : null,
      });
    }
    const tourGuideBalanceAdd = (system.commission / 100) * order.price;
    await Promise.all([
      this.orderRepository.update(
        { id: order.id },
        {
          status: OrderStatus.DONE,
        },
      ),
      this.systemRepository.update(
        { id: system.id },
        { balance: system.balance - tourGuideBalanceAdd },
      ),
      this.tourGuideRepository.update(
        { id: order.tourGuide.id },
        {
          availableBalance:
            order.tourGuide.availableBalance +
            order.tourGuideDeposit +
            tourGuideBalanceAdd,
          balance: order.tourGuide.balance + tourGuideBalanceAdd,
        },
      ),
    ]);
    return httpResponse.END_ORDER_SUCCESS;
  }

  async userPrepaidOrder(
    body: PrepaidOrderDto,
    userId: number,
  ): Promise<Response> {
    const { orderId } = body;
    const [order, user] = await Promise.all([
      this.orderRepository.findOne({
        where: {
          id: orderId,
          status: OrderStatus.WAITING_PREPAID,
        },
      }),
      this.userRepository.findOne({
        where: { id: userId, status: UserStatus.ACTIVE },
      }),
    ]);
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (
      user.availableBalance < +order.price * 0.1 ||
      user.balance < +order.price * 0.1
    ) {
      throw new HttpException(
        httpErrors.USER_INSUFFICIENT_BALANCE,
        HttpStatus.BAD_REQUEST,
      );
    }
    await Promise.all([
      this.orderRepository.update(
        { id: order.id, paid: 0.1 * order.price },
        {
          status: OrderStatus.WAITING_PURCHASE,
        },
      ),
      this.userRepository.update(
        { id: user.id },
        {
          availableBalance: user.availableBalance - 0.1 * order.price,
          balance: user.balance - 0.1 * order.price,
        },
      ),
    ]);
    return httpResponse.APPROVE_ORDER_SUCCESS;
  }

  async cancelOrder(body: CancelOrderDto, actor: string) {
    const { orderId } = body;
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        status: Not(
          In([OrderStatus.DONE, OrderStatus.PROCESSING, OrderStatus.REJECTED]),
        ),
      },
    });
    if (!order) {
      throw new HttpException(httpErrors.ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
