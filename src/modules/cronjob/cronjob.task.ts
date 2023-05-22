import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { UserRepository } from 'src/models/repositories/user.repository';

@Injectable()
export class CronTask {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCron() {
    // Your task logic goes here
    // const user = await this.userRepository.findOne();
    // console.log(user);
  }
}
