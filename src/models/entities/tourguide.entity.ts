import { UserFavorite } from './user_favorite.entity';
import { Gender, TourguideStatus } from 'src/shares/enum/tourguide.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { Province } from './province.entity';
import { Report } from './report.entity';
import { Tour } from './tour.entity';
import { Wallet } from './wallet.entity';
import { Order } from './orders.entity';
import { TransactionEntity } from './transaction.entity';
import { Chat } from './chat.entity';

@Entity({ name: 'tour_guides' })
export class TourGuide extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'password' })
  password: string;

  @Index()
  @Column({ nullable: false, name: 'email' })
  email: string;

  @Index()
  @Column({ nullable: false, name: 'name' })
  name: string;

  @Index()
  @Column({ nullable: false, name: 'username' })
  username: string;

  @Index()
  @Column({ nullable: true, name: 'phone' })
  phone: string;

  @Column({ name: 'bio', type: 'text', nullable: false })
  bio: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

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
    nullable: false,
    default:
      'https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj',
    name: 'avartar',
    type: 'varchar',
  })
  avatar: string;

  @Column({
    nullable: false,
    name: 'status',
    type: 'enum',
    enum: TourguideStatus,
    default: TourguideStatus.PENDING,
  })
  verifyStatus: TourguideStatus;

  @Column({
    nullable: true,
    name: 'available',
    type: 'boolean',
  })
  available: boolean;

  @Column({ name: 'num_of_favorites', default: 0, type: 'integer' })
  numOfFavorites: number;

  @Column({ name: 'cancelled_orders', default: 0, type: 'integer' })
  cancelledOrders: number;

  @Column({ name: 'dob', type: 'date', nullable: false })
  dob: Date;

  @Column({ name: 'interview_date', type: 'date', nullable: true })
  interviewDate: Date;

  @ManyToMany(() => Province, (province) => province.tourGuides)
  @JoinTable()
  provinces: Province[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Order, (order) => order.tourGuide)
  orders: Order[];

  @OneToMany(() => Post, (post) => post.tourGuide)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.tourGuide)
  comments: Comment[];

  @OneToMany(() => Tour, (tour) => tour.tourGuide)
  tours: Tour[];

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.tourGuide)
  userFavorites: UserFavorite[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.tourGuide)
  transactions: TransactionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Chat, (chat) => chat.tourGuide)
  chats: Chat[];
}
