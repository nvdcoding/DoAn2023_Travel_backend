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
import {
  BasePaginationRequestDto,
  BasePaginationResponseDto,
} from 'src/shares/dtos/base-pagination.dto';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { GetTransactionDto } from 'src/shares/dtos/get-transaction.dto';
import { Between } from 'typeorm';
import { ActorRole } from 'src/shares/enum/auth.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly tourGuideRepository: TourGuideRepository,
  ) {}

  async userWithdraw(body: WithdrawDto, userId: number): Promise<Response> {
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
    return httpResponse.CREATE_TRANSACTION_SUCCESS;
  }

  async tourGuideWithdraw(
    body: WithdrawDto,
    tourGuideId: number,
  ): Promise<Response> {
    const { amount } = body;
    const tourGuide = await this.tourGuideRepository.findOne({
      where: { id: tourGuideId, verifyStatus: TourguideStatus.ACTIVE },
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
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
    return httpResponse.CREATE_TRANSACTION_SUCCESS;
  }

  async getListWithdrawRequest(options: GetTransactionDto): Promise<Response> {
    const { limit, page, startDate, endDate } = options;
    const transactions = await this.transactionRepository.findAndCount({
      where: {
        time: Between(startDate, endDate),
        status: TransactionStatus.WAITING,
      },
      relations: ['user', 'tourguide'],
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      ...httpResponse.GET_TRANSACTION_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        transactions,
        page,
        limit,
      ),
    };
  }

  async getMyListWithdraw(
    actorId: number,
    role: ActorRole,
    options: GetTransactionDto,
  ): Promise<Response> {
    const { limit, page, startDate, endDate } = options;
    switch (role) {
      case ActorRole.TOURGUIDE:
        const tourGuide = await this.tourGuideRepository.findOne({
          id: actorId,
          verifyStatus: TourguideStatus.ACTIVE,
        });
        const tourGuideTransactions =
          await this.transactionRepository.findAndCount({
            where: {
              time: Between(startDate, endDate),
              status: TransactionStatus.WAITING,
              tourGuide,
            },
            relations: ['user', 'tourguide'],
            order: {
              id: 'DESC',
            },
            take: limit,
            skip: (page - 1) * limit,
          });
        return {
          ...httpResponse.GET_TRANSACTION_SUCCESS,
          returnValue:
            BasePaginationResponseDto.convertToPaginationWithTotalPages(
              tourGuideTransactions,
              page,
              limit,
            ),
        };
        break;
      case ActorRole.USER:
        const user = await this.tourGuideRepository.findOne({
          id: actorId,
          verifyStatus: TourguideStatus.ACTIVE,
        });
        const transactions = await this.transactionRepository.findAndCount({
          where: {
            time: Between(startDate, endDate),
            status: TransactionStatus.WAITING,
            user,
          },
          relations: ['user', 'tourguide'],
          order: {
            id: 'DESC',
          },
          take: limit,
          skip: (page - 1) * limit,
        });
        return {
          ...httpResponse.GET_TRANSACTION_SUCCESS,
          returnValue:
            BasePaginationResponseDto.convertToPaginationWithTotalPages(
              transactions,
              page,
              limit,
            ),
        };
        break;
      default:
        break;
    }
  }
}
