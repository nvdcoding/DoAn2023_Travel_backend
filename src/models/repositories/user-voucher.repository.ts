import { EntityRepository, Repository } from 'typeorm';
import { UserVoucher } from '../entities/user_voucher.entity';

@EntityRepository(UserVoucher)
export class UserVoucherRepository extends Repository<UserVoucher> {}
