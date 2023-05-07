import { UserFavorite } from './user_favorite.entity';
import { UserStatus } from 'src/shares/enum/user.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { Report } from './report.entity';
import { UserVoucher } from './user_voucher.entity';
import { Wallet } from './wallet.entity';
import { Order } from './orders.entity';
import { TransactionEntity } from './transaction.entity';
import { UserRequest } from './user-request.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'password' })
  password: string;

  @Index()
  @Column({ nullable: false, name: 'email' })
  email: string;

  @Index()
  @Column({ nullable: false, name: 'username' })
  username: string;

  @Index()
  @Column({ nullable: true, name: 'phone' })
  phone: string;

  @Column({
    type: 'int',
    default: 0,
    name: 'balance',
    unsigned: true,
  })
  balance: number;

  @Column({
    type: 'int',
    default: 0,
    name: 'available_balance',
    unsigned: true,
  })
  availableBalance: number;

  @Column({
    type: 'int',
    default: 0,
    name: 'voucher_point',
  })
  voucherPoint: number;

  @Column({
    nullable: false,
    default: 'default-avartar-url',
    name: 'avartar',
    type: 'varchar',
  })
  avatar: string;

  @Column({
    nullable: false,
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  verifyStatus: UserStatus;

  @Column({
    nullable: true,
    name: 'isSetup',
    type: 'boolean',
  })
  isSetup: boolean;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Report, (report) => report.reportedBy)
  reports: Report[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.user)
  userVouchers: UserVoucher[];

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.user)
  userFavorites: UserFavorite[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => UserRequest, (userRequest) => userRequest.user)
  requests: UserRequest[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
