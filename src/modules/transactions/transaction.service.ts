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
  AproveActionWithdraw,
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
import { AdminStatus } from 'src/shares/enum/admin.enum';
import { AdminAproveWithdrawRequest } from './dtos/admin-prove.dto';
import { SystemRepository } from 'src/models/repositories/system.repository';
import * as moment from 'moment';
import { PostRepository } from 'src/models/repositories/post.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { RateRepository } from 'src/models/repositories/rate.repository';
import { OrderStatus } from 'src/shares/enum/order.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly adminRepository: AdminRepository,
    private readonly systemRepository: SystemRepository,
    private readonly postRepository: PostRepository,
    private readonly orderRepository: OrderRepository,
    private readonly rateRepository: RateRepository,
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
        wallet: null,
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
        wallet: null,
      }),
    ]);
    return httpResponse.CREATE_TRANSACTION_SUCCESS;
  }

  async getListWithdrawRequest(options: GetTransactionDto): Promise<Response> {
    const { limit, page, startDate, endDate } = options;
    const transactions = await this.transactionRepository.findAndCount({
      where: {
        time: Between(
          new Date(startDate),
          new Date(moment(endDate).add(1, 'day').toString()),
        ),
        status: TransactionStatus.WAITING,
      },
      relations: ['user', 'tourGuide'],
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

  async getTransactionsByDateRange(dto: GetTransactionDto): Promise<Response> {
    const { startDate, endDate, limit, page } = dto;
    const startDateDb = new Date(startDate);
    const endDateDb = new Date(moment(endDate).add(1, 'day').toString());

    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.tourGuide', 'tourGuide')
      .where(
        'transaction.updatedAt >= :startDate AND transaction.updatedAt <= :endDate',
        {
          startDate: startDateDb,
          endDate: endDateDb,
        },
      )
      .orderBy('transaction.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, countData] = await Promise.all([
      query.getRawMany(),
      query.getCount(),
    ]);
    // const;
    const [goodRates, badRates, profit, orders] = await Promise.all([
      this.rateRepository
        .createQueryBuilder('rate')
        .where('rate.star >= 4')
        .andWhere(
          'rate.createdAt >= :startDate AND  rate.createdAt <= :endDate',
          {
            startDate: startDateDb,
            endDate: endDateDb,
          },
        )
        .getCount(),
      this.rateRepository
        .createQueryBuilder('rate')
        .where('rate.star <= 4')
        .andWhere(
          'rate.createdAt >= :startDate AND  rate.createdAt <= :endDate',
          {
            startDate: startDateDb,
            endDate: endDateDb,
          },
        )
        .getCount(),
      this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'totalAmount')
        .where('transaction.status = :status', {
          status: TransactionStatus.SUCCESS,
        })
        .andWhere('transaction.updatedAt >= :startDate', {
          startDate: startDateDb,
        })
        .andWhere('transaction.updatedAt <= :endDate', { endDate: endDateDb })
        .andWhere('transaction.type = :type', {
          type: TransactionType.PROFIT_SYSTEM,
        })
        .getRawOne(),
      this.orderRepository
        .createQueryBuilder('order')
        .where('order.status = :status', { status: OrderStatus.DONE })
        .andWhere(
          'order.updatedAt >= :startDate AND  rate.updatedAt <= :endDate',
          {
            startDate: startDateDb,
            endDate: endDateDb,
          },
        )
        .getCount(),
    ]);
    return {
      ...httpResponse.GET_TRANSACTION_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        [data, countData],
        page,
        limit,
      ),
      options: {
        goodRates,
        badRates,
        totalProfit: profit.totalAmount ? parseFloat(profit.totalAmount) : 0,
        numOfOrders: orders,
      },
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
              time: Between(
                new Date(startDate),
                new Date(moment(endDate).add(1, 'day').toString()),
              ),
              status: TransactionStatus.WAITING,
              tourGuide,
            },
            relations: ['user', 'tourGuide'],
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
        const user = await this.userRepository.findOne({
          id: actorId,
          verifyStatus: UserStatus.ACTIVE,
        });
        const transactions = await this.transactionRepository.findAndCount({
          where: {
            time: Between(
              new Date(startDate),
              new Date(moment(endDate).add(1, 'day').toString()),
            ),
            status: TransactionStatus.WAITING,
            user,
          },
          relations: ['user', 'tourGuide'],
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

  async approveRequestWithdraw(
    body: AdminAproveWithdrawRequest,
    actorId: number,
  ): Promise<Response> {
    const { withdrawId, action } = body;
    const [actor, withdraw, system] = await Promise.all([
      this.adminRepository.findOne({
        where: {
          id: actorId,
          status: AdminStatus.ACTIVE,
        },
      }),
      this.transactionRepository.findOne({
        where: {
          id: withdrawId,
          status: TransactionStatus.WAITING,
          type: TransactionType.WITHDRAW,
        },
        relations: ['tourGuide', 'user'],
      }),
      this.systemRepository.findOne(),
    ]);
    if (!actor) {
      throw new HttpException(httpErrors.ADMIN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!withdraw) {
      throw new HttpException(
        httpErrors.REQUEST_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    switch (action) {
      case AproveActionWithdraw.ACCEPT:
        if (withdraw.tourGuide !== null) {
          await Promise.all([
            this.tourGuideRepository.update(
              { id: withdraw.tourGuide.id },
              { balance: withdraw.tourGuide.balance - withdraw.amount },
            ),
            // this.systemRepository.update(
            //   { id: system.id },
            //   {
            //     balance: system.balance - withdraw.amount,
            //   },
            // ),
            this.transactionRepository.update(
              { id: withdrawId },
              {
                status: TransactionStatus.SUCCESS,
                admin: actor,
              },
            ),
          ]);
        } else {
          await Promise.all([
            this.userRepository.update(
              { id: withdraw.user.id },
              { balance: withdraw.user.balance - withdraw.amount },
            ),
            // this.systemRepository.update(
            //   { id: system.id },
            //   {
            //     balance: system.balance - withdraw.amount,
            //   },
            // ),
            this.transactionRepository.update(
              { id: withdrawId },
              {
                status: TransactionStatus.SUCCESS,
                admin: actor,
              },
            ),
          ]);
        }
        break;
      case AproveActionWithdraw.REJECT: {
        if (withdraw.tourGuide !== null) {
          await Promise.all([
            this.tourGuideRepository.update(
              { id: withdraw.tourGuide.id },
              {
                availableBalance:
                  withdraw.tourGuide.availableBalance - withdraw.amount,
              },
            ),
            this.transactionRepository.update(
              { id: withdrawId },
              {
                status: TransactionStatus.FAILED,
                admin: actor,
              },
            ),
          ]);
        } else {
          await Promise.all([
            this.userRepository.update(
              { id: withdraw.user.id },
              {
                availableBalance:
                  withdraw.user.availableBalance - withdraw.amount,
              },
            ),
            this.transactionRepository.update(
              { id: withdrawId },
              {
                status: TransactionStatus.FAILED,
                admin: actor,
              },
            ),
          ]);
        }
        break;
      }
      default:
        break;
    }
    return httpResponse.ACTIVE_ADMIN_SUCCESS;
  }
}
