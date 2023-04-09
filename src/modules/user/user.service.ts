import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { UserRepository } from 'src/models/repositories/user.repository';
import { httpErrors } from 'src/shares/exceptions';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
