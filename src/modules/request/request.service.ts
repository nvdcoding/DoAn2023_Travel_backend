import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { UserRequestRepository } from 'src/models/repositories/request.repository';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import {
  BasePaginationRequestDto,
  BasePaginationResponseDto,
} from 'src/shares/dtos/base-pagination.dto';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In } from 'typeorm';
import { CreateRequestDto } from './dtos/create-request.dto';
import { GetUserRequestDto } from './dtos/get-request.dto';
@Injectable()
export class RequestService {
  constructor(
    private readonly userRequestRepository: UserRequestRepository,
    private readonly provinceRepository: ProvinceRepository,
    private readonly userRepository: UserRepository,
    private readonly tourGuideRepository: TourGuideRepository,
  ) {}

  async createRequest(
    body: CreateRequestDto,
    userId: number,
  ): Promise<Response> {
    const { provinceId, content } = body;
    const [province, user] = await Promise.all([
      this.provinceRepository.findOne({
        where: { id: provinceId },
      }),
      this.userRepository.findOne({
        where: { verifyStatus: UserStatus.ACTIVE, id: userId },
      }),
    ]);
    if (!province) {
      throw new HttpException(
        httpErrors.PROVINCE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.userRequestRepository.insert({
      province,
      content,
      user,
    });
    return httpResponse.CREATE_REQUEST_SUCCESS;
  }

  async getMyRequest(
    options: GetUserRequestDto,
    userId: number,
  ): Promise<Response> {
    const { limit, page, provinceId } = options;
    const where = {};
    const user = await this.userRepository.findOne({
      where: { verifyStatus: UserStatus.ACTIVE, id: userId },
    });
    if (provinceId) {
      const province = await this.provinceRepository.findOne(provinceId);
      where['province'] = province;
    }
    const requests = await this.userRequestRepository.findAndCount({
      where: {
        ...where,
        user,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      },
      relations: ['user', 'province'],
    });
    return {
      ...httpResponse.GET_REQUEST_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        requests,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async tourGuideGetRequest(
    options: BasePaginationRequestDto,
    tourGuideId: number,
  ): Promise<Response> {
    const { limit, page } = options;
    const tourGuide = await this.tourGuideRepository.findOne({
      where: {
        id: tourGuideId,
        verifyStatus: TourguideStatus.ACTIVE,
      },
      relations: ['provinces'],
    });
    if (!tourGuide) {
      throw new HttpException(
        httpErrors.TOUR_GUIDE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const tourGuideProvinces = tourGuide.provinces.map(
      (province) => province.id,
    );
    const requests = await this.userRequestRepository.findAndCount({
      where: {
        id: In([...tourGuideProvinces]),
      },
      relations: ['province', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      },
    });
    return {
      ...httpResponse.GET_REQUEST_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        requests,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async getOneRequest(
    requestId: number,
    actorId: number,
    role: ActorRole,
  ): Promise<Response> {
    if (role === ActorRole.ADMIN) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    } else if (role === ActorRole.USER) {
      const [request, user] = await Promise.all([
        this.userRequestRepository.findOne({
          where: { id: requestId },
          relations: ['user', 'province'],
        }),
        this.userRepository.findOne({
          where: {
            id: actorId,
            verifyStatus: UserStatus.ACTIVE,
          },
        }),
      ]);
      if (!request) {
        throw new HttpException(
          httpErrors.REQUEST_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!user) {
        throw new HttpException(
          httpErrors.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (user.id !== request.user.id) {
        throw new HttpException(
          httpErrors.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      return { ...httpResponse.GET_REQUEST_SUCCESS, returnValue: request };
    } else {
      const [request, tourGuide] = await Promise.all([
        this.userRequestRepository.findOne({
          where: { id: requestId },
          relations: ['user', 'province'],
        }),
        this.tourGuideRepository.findOne({
          where: {
            id: actorId,
            verifyStatus: TourguideStatus.ACTIVE,
          },
          relations: ['provinces'],
        }),
      ]);
      if (!request) {
        throw new HttpException(
          httpErrors.REQUEST_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!tourGuide) {
        throw new HttpException(
          httpErrors.TOUR_GUIDE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const tourGuideProvinces = tourGuide.provinces.map((e) => e.id);
      if (!tourGuideProvinces.includes(request.province.id)) {
        throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.NOT_FOUND);
      }
      return { ...httpResponse.GET_REQUEST_SUCCESS, returnValue: request };
    }
  }

  async deleteMyRequest(requestId: number, userId: number): Promise<Response> {
    const [request, user] = await Promise.all([
      this.userRequestRepository.findOne({
        where: { id: requestId },
        relations: ['user', 'province'],
      }),
      this.userRepository.findOne({
        where: { id: userId, verifyStatus: UserStatus.ACTIVE },
      }),
    ]);
    if (user.id !== request.user.id) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    await this.userRequestRepository.delete(request.id);
    return httpResponse.DELETE_REQUEST_SUCCESS;
  }
}
