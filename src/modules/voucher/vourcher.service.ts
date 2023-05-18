import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VoucherRepository } from 'src/models/repositories/voucher.repository';
import { httpErrors } from 'src/shares/exceptions';
import { Response } from 'src/shares/response/response.interface';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import * as moment from 'moment';
import { Voucher } from 'src/models/entities/voucher.entity';
import { httpResponse } from 'src/shares/response';
import { GetVoucherDto } from './dtos/get-voucher.dto';
import { LessThan, MoreThan } from 'typeorm';
import { UserRepository } from 'src/models/repositories/user.repository';
import { UserVoucherRepository } from 'src/models/repositories/user-voucher.repository';
import { UserStatus } from 'src/shares/enum/user.enum';
import { UserVoucher } from 'src/models/entities/user_voucher.entity';
import { UserVoucherStatus } from 'src/shares/enum/voucher.enum';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly userRepository: UserRepository,
    private readonly userVoucherRepository: UserVoucherRepository,
  ) {}

  async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Response> {
    const {
      name,
      startDate,
      endDate,
      quantity,
      value,
      requirementPoint: requirementPrice,
      discountType,
      code,
    } = createVoucherDto;

    // Check if voucher with the same name already exists
    const existingVoucher = await this.voucherRepository.findOne({
      where: { name },
    });
    if (existingVoucher) {
      throw new HttpException(httpErrors.VOUCHER_EXIST, HttpStatus.FOUND);
    }

    // Create voucher
    const voucher = new Voucher();
    voucher.name = name;
    voucher.code = code;
    voucher.discountType = discountType;
    voucher.requirementPoint = requirementPrice;
    voucher.quantity = quantity;
    voucher.value = value;
    voucher.startDate = moment(startDate).toDate();
    voucher.endDate = moment(endDate).toDate();

    await this.voucherRepository.save(voucher);
    return httpResponse.CREATE_VOUCHER_SUCCESS;
  }

  async getAllVoucher(options: GetVoucherDto, userId: number | null) {
    const { discountType, limit, page } = options;
    let data;
    if (discountType) {
      data = await this.voucherRepository.getVouchers(
        limit,
        page,
        discountType,
        userId,
      );
    } else {
      data = await this.voucherRepository.getVouchers(
        page,
        limit,
        null,
        userId,
      );
    }

    return {
      returnValue: data,
      ...httpResponse.GET_VOUCHER_SUCCESS,
    };
  }

  async claimVoucher(voucherId: number, userId: number) {
    const [user, voucher] = await Promise.all([
      this.userRepository.findOne({
        where: {
          id: userId,
          verifyStatus: UserStatus.ACTIVE,
        },
      }),
      this.voucherRepository.findOne(voucherId, {
        relations: ['userVouchers'],
      }),
    ]);
    const currentDate = new Date();
    if (currentDate > voucher.endDate) {
      throw new HttpException(
        httpErrors.VOUCHER_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!voucher) {
      throw new HttpException(
        httpErrors.VOUCHER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (+user.voucherPoint < +voucher.requirementPoint) {
      throw new HttpException(
        httpErrors.NOT_ENOUGHT_VOUCHER_POINT,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (+voucher.quantity < 1) {
      throw new HttpException(
        httpErrors.VOUCHER_NOT_ENOUGH,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check if the user has already claimed the voucher
    const existingUserVoucher = await this.userVoucherRepository.findOne({
      where: { user, voucher },
    });
    if (existingUserVoucher) {
      throw new HttpException(
        httpErrors.VOUCHER_ALREADY_CLAIM,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create a new user voucher
    const userVoucher = new UserVoucher();
    userVoucher.user = user;
    userVoucher.voucher = voucher;
    userVoucher.status = UserVoucherStatus.AVAILABLE;

    await Promise.all([
      this.userRepository.update(userId, {
        voucherPoint:
          +voucher.requirementPoint === 0
            ? voucher.requirementPoint
            : +user.voucherPoint - voucher.requirementPoint,
      }),
      this.userVoucherRepository.save(userVoucher),
    ]);

    return httpResponse.CLAIM_VOUCHER_SUCCESS;
  }

  async getAllAvailableVouchersForUser(userId: number): Promise<Response> {
    // Retrieve the user from the database
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Retrieve all user vouchers with status 'AVAILABLE' for the user
    const userVouchers = await this.userVoucherRepository.find({
      where: { user, status: UserVoucherStatus.AVAILABLE },
      relations: ['voucher'],
    });

    // Extract the vouchers from the user vouchers
    const vouchers = userVouchers.map((userVoucher) => userVoucher.voucher);

    return { returnValue: vouchers, ...httpResponse.GET_VOUCHER_SUCCESS };
  }
}
