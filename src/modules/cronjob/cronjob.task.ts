import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import {
  TransactionStatus,
  TransactionType,
} from 'src/shares/enum/transaction.enum';
import * as moment from 'moment';
import { OrderStatus } from 'src/shares/enum/order.enum';
import { LessThan, LessThanOrEqual } from 'typeorm';
import { SystemRepository } from 'src/models/repositories/system.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
@Injectable()
export class CronTask {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly systemRepository: SystemRepository,
    private readonly tourGuideRepository: TourGuideRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCron() {
    // Your task logic goes here
    // const user = await this.userRepository.findOne();
    // console.log(user);
    await this.changePendingTransaction();
    await this.changeOrderNotPrePaid();
  }

  private async changePendingTransaction() {
    const transactions = await this.transactionRepository.find({
      where: {
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.VNPAY_PENDING,
      },
    });
    const filtered = transactions.filter((transaction) => {
      const currentTime = moment();
      const specificTime = moment(transaction.time);
      const timeDifference = moment.duration(currentTime.diff(specificTime));
      const isTimeDifferenceGreaterThan15Minutes =
        timeDifference.asMinutes() > 15;
      return isTimeDifferenceGreaterThan15Minutes;
    });
    // Output: false
    await Promise.all(
      filtered.map((e) => {
        this.transactionRepository.update(
          { id: e.id },
          { status: TransactionStatus.FAILED },
        );
      }),
    );
  }
  private async changeOrderNotPrePaid() {
    const currentTime = moment().format('YYYY-MM-DD');
    const [orderNotPrepaid, system] = await Promise.all([
      this.orderRepository.find({
        where: {
          status: OrderStatus.WAITING_PREPAID,
          deadlinePrepaid: LessThan(currentTime),
        },
        relations: ['tourGuide'],
      }),
      this.systemRepository.findOne(),
    ]);
    const task = [];
    for (const order of orderNotPrepaid) {
      task.push(
        this.orderRepository.update(
          { id: order.id },
          { status: OrderStatus.REJECTED },
        ),
      );
      task.push(
        this.systemRepository.update(
          { id: system.id },
          {
            balance: () => `system.balance - ${+order.tourGuideDeposit}`,
          },
        ),
      );
      task.push(
        this.tourGuideRepository.update(
          { id: order.tourGuide.id },
          {
            availableBalance: () =>
              `tour_guides.available_balance + ${order.tourGuideDeposit}`,
            balance: () => `tour_guides.balance + ${order.tourGuideDeposit}`,
          },
        ),
      );
      task.push(
        this.transactionRepository.insert({
          tourGuide: order.tourGuide,
          amount: +order.tourGuideDeposit,
          type: TransactionType.BACK_PREPAID,
          status: TransactionStatus.SUCCESS,
          wallet: null,
          time: null,
          user: null,
        }),
      );
    }
    await Promise.all([...task]);
  }
}
