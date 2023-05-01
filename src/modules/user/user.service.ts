import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { UserRepository } from 'src/models/repositories/user.repository';
import { httpErrors } from 'src/shares/exceptions';
import { TransferDto } from './dtos/transfer.dto';
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

  // async userDeposit(body: TransferDto, userId: number): Promise<Response> {
  //   const object = {
  //     partnerCode: 'MOMOBKUN20180529',
  //     partnerName: 'Test',
  //     storeId: 'MoMoTestStore',
  //     requestType: 'captureWallet',
  //     ipnUrl: 'https://momo.vn',
  //     redirectUrl: 'https://momo.vn',
  //     orderId: 'MM1540456472575',
  //     amount: 150000,
  //     lang: 'vi',
  //     orderInfo: 'SDK team.',
  //     requestId: 'MM1540456472575',
  //     extraData: 'eyJ1c2VybmFtZSI6ICJtb21vIn0=',
  //     signature:
  //       'fd37abbee777e13eaa0d0690d184e4d7e2fb43977281ab0e20701721f07a0e07',
  //     items: {
  //       id: '204727',
  //       name: 'YOMOST Bac Ha&Viet Quat 170ml',
  //       description: 'YOMOST Sua Chua Uong Bac Ha&Viet Quat 170ml/1 Hop',
  //       category: 'beverage',
  //       imageUrl: 'https://momo.vn/uploads/product1.jpg',
  //       manufacturer: 'Vinamilk',
  //       price: 11000,
  //       quantity: 5,
  //       unit: 'hộp',
  //       totalPrice: 55000,
  //       taxAmount: '200',
  //     },
  //     userInfo: {
  //       name: 'Nguyen Van A',
  //       phoneNumber: '0999888999',
  //       email: 'email_add@domain.com',
  //     },
  //     deliveryInfo: {
  //       deliveryAddress: 'Phu My Hung Tower',
  //       deliveryFee: '30000',
  //       quantity: '2',
  //     },
  //   };
  // }
}
