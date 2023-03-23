import { UserVoucherStatus } from 'src/shares/enum/voucher.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Voucher } from './voucher.entity';

@Entity({ name: 'user_voucher' })
export class UserVoucher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserVoucherStatus,
    default: UserVoucherStatus.AVAILABLE,
    nullable: false,
  })
  status: UserVoucherStatus;

  @ManyToOne(() => User, (user) => user.userVouchers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Voucher, (voucher) => voucher.userVouchers)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
