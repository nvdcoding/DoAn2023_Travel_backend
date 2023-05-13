import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { PermissionRepository } from 'src/models/repositories/permission.repository';
import { WithdrawDto } from './dtos/withdraw.dto';
import { UserRepository } from 'src/models/repositories/user.repository';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import {
  TransactionStatus,
  TransactionType,
} from 'src/shares/enum/transaction.enum';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly tourGuideRepository: TourGuideRepository,
  ) {}

  async userWithdraw(body: WithdrawDto, userId: number) {
    const { amount } = body;
    const user = await this.userRepository.findOne({
      where: { id: userId, verifyStatus: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (+user.availableBalance < +amount || +user.balance < +amount) {
      throw new HttpException(
        httpErrors.USER_INSUFFICIENT_BALANCE,
        HttpStatus.BAD_REQUEST,
      );
    }
    await Promise.all([
      this.userRepository.update(
        { id: userId },
        { availableBalance: +user.availableBalance - +amount },
      ),
      this.transactionRepository.insert({
        user,
        status: TransactionStatus.WAITING,
        amount,
        type: TransactionType.WITHDRAW,
        time: new Date(),
      }),
    ]);
  }

  async tourGuideWithdraw(body: WithdrawDto, tourGuideId: number) {
    const { amount } = body;
    const tourGuide = await this.tourGuideRepository.findOne({
      where: { id: tourGuideId, verifyStatus: TourguideStatus.ACTIVE },
    });
    if (!tourGuide) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (+tourGuide.availableBalance < +amount || +tourGuide.balance < +amount) {
      throw new HttpException(
        httpErrors.USER_INSUFFICIENT_BALANCE,
        HttpStatus.BAD_REQUEST,
      );
    }
    await Promise.all([
      this.tourGuideRepository.update(
        { id: tourGuideId },
        { availableBalance: +tourGuide.availableBalance - +amount },
      ),
      this.transactionRepository.insert({
        tourGuide: tourGuide,
        status: TransactionStatus.WAITING,
        amount,
        type: TransactionType.WITHDRAW,
        time: new Date(),
      }),
    ]);
  }
}
