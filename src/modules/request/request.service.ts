import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { UserRequestRepository } from 'src/models/repositories/request.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { UserStatus } from 'src/shares/enum/user.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { CreateRequestDto } from './dtos/create-request.dto';
@Injectable()
export class RequestService {
  constructor(
    private readonly userRequestRepository: UserRequestRepository,
    private readonly provinceRepository: ProvinceRepository,
    private readonly userRepository: UserRepository,
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
}
