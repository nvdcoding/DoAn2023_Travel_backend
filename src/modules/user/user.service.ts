/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { of } from 'rxjs';
import { vnPayConfig } from 'src/configs/digital-wallet';
import { PostRepository } from 'src/models/repositories/post.repository';
import { TransactionRepository } from 'src/models/repositories/transaction.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import {
  BasePaginationRequestDto,
  BasePaginationResponseDto,
} from 'src/shares/dtos/base-pagination.dto';
import { PostStatus } from 'src/shares/enum/post.enum';
import {
  TransactionStatus,
  TransactionType,
} from 'src/shares/enum/transaction.enum';
import { ChangeStatus, UserStatus } from 'src/shares/enum/user.enum';
import { WALLET_TYPE } from 'src/shares/enum/wallet.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In, Like, Not } from 'typeorm';
import { promisify } from 'util';
import { AdminChangeStatusUserDto } from './dtos/change-user-status.dto';
import { AdminGetUsersDto } from './dtos/get-list-user.dto';
import { TransferDto } from './dtos/transfer.dto';
const getIP = promisify(require('external-ip')());

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserPost(
    options: BasePaginationRequestDto,
    userId: number,
  ): Promise<Response> {
    const user = await this.userRepository.findOne({
      where: { id: userId, verifyStatus: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const posts = await this.postRepository.findAndCount({
      where: { status: In([PostStatus.ACTIVE, PostStatus.WAITING]), user },
      relations: ['userFavorites', 'user', 'comments'],
      take: options.limit,
      skip: (options.page - 1) * options.limit,
    });

    return {
      ...httpResponse.GET_POST_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        posts,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async getListUser(options: AdminGetUsersDto): Promise<Response> {
    const { keyword, limit, page } = options;
    const users = await this.userRepository.getUsers(keyword, page, limit);
    return {
      ...httpResponse.GET_USER_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        users,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async changeUserStatus(body: AdminChangeStatusUserDto): Promise<Response> {
    const { status, userId } = body;
    const user = await this.userRepository.findOne({
      id: userId,
      verifyStatus: Not(UserStatus.INACTIVE),
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    // to do send mail
    await this.userRepository.update(
      { id: userId },
      {
        verifyStatus:
          status === ChangeStatus.ACTIVE
            ? UserStatus.ACTIVE
            : UserStatus.LOCKED,
      },
    );
    return httpResponse.CHANGE_USER_STATUS_SUCCESS;
  }

  async deleteUser(userId: number): Promise<Response> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.userRepository.softDelete(user.id);
    return httpResponse.DELETE_USER_SUCCES;
  }

  sortObject(obj) {
    const sorted = {};
    const keys = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    keys.sort();
    const keysLength = keys.length;
    for (let i = 0; i < keysLength; i++) {
      sorted[keys[i]] = obj[keys[i]];
    }

    return sorted;
  }

  async genUrlPay(body: TransferDto, userId: number): Promise<Response> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        verifyStatus: UserStatus.ACTIVE,
      },
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const ipAddr = await getIP();
    const tmnCode = `${vnPayConfig.TMN_CODE}`;
    const secretKey = `${vnPayConfig.HASH_SECRET}`;
    let vnpUrl = vnPayConfig.URL;
    const returnUrl = vnPayConfig.RETURN_URL;
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const amount = body.amount;
    const bankCode = 'NCB';
    const orderInfo = `${orderId}`;
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = +createDate;
    // if (bankCode !== null && bankCode !== '') {
    // vnp_Params['vnp_BankCode'] = bankCode;
    // vnp_Params['vnp_ExpireDate'] = expiredDate;
    // }
    vnp_Params = this.sortObject(vnp_Params);
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: true });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
    await this.transactionRepository.insert({
      status: TransactionStatus.PENDING,
      amount,
      transactionCode: orderId,
      time: date,
      user,
      type: TransactionType.DEPOSIT,
      wallet: WALLET_TYPE.VN_PAY,
    });
    return { ...httpResponse.GEN_LINK_SUCCESS, returnValue: vnpUrl };
  }

  async getUserTransaction(
    options: BasePaginationRequestDto,
    userId: number,
  ): Promise<Response> {
    const { limit, page } = options;
    const user = await this.userRepository.findOne({
      where: { id: userId, verifyStatus: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const transaction = await this.transactionRepository.findAndCount({
      where: { user },
    });
    return {
      ...httpResponse.GET_TRANSACTION_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        transaction,
        page,
        limit,
      ),
    };
  }

  async IPNUrl(query) {
    const { vnp_Amount, vnp_ResponseCode, vnp_TransactionStatus, vnp_TxnRef } =
      query;
    const secureHash = query['vnp_SecureHash'];
    console.log(query);

    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];
    query = this.sortObject(query);
    const secretKey = `${vnPayConfig.HASH_SECRET}`;
    const querystring = require('qs');
    const signData = querystring.stringify(query, { encode: true });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    if (secureHash === signed) {
      const orderId = query['vnp_TxnRef'];
      const rspCode = query['vnp_ResponseCode'];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      const transaction = await this.transactionRepository.findOne({
        where: { transactionCode: orderId },
        relations: ['user'],
      });
      const user = await this.userRepository.findOne({
        where: { id: transaction.user.id, verifyStatus: UserStatus.ACTIVE },
      });
      if (rspCode == '00') {
        await Promise.all([
          this.transactionRepository.update(
            { id: transaction.id },
            {
              status: TransactionStatus.SUCCESS,
            },
          ),
          this.userRepository.update(
            { id: transaction.user.id },
            {
              balance: user.balance + +vnp_Amount / 100,
              availableBalance: user.availableBalance + +vnp_Amount / 100,
            },
          ),
        ]);
      } else {
        await this.transactionRepository.update(
          { id: transaction.id },
          {
            status: TransactionStatus.SUCCESS,
          },
        );
      }
    } else {
      console.log({
        hash: secureHash,
        signed,
      });

      console.log('Error');
    }
  }
}
