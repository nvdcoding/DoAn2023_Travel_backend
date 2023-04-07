import { UserFavorite } from './user_favorite.entity';
import { Gender, TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { Province } from './province.entity';
import { Report } from './report.entity';
import { Tour } from './tour.entity';
import { Voucher } from './voucher.entity';
import { Wallet } from './wallet.entity';

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
    type: 'bigint',
    default: 0,
    name: 'balance',
    unsigned: true,
  })
  balance: string;

  @Column({
    type: 'bigint',
    default: 0,
    name: 'available_balance',
    unsigned: true,
  })
  availableBalance: string;

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

  @Column({ name: 'dob', type: 'date', nullable: false })
  dob: Date;

  @ManyToMany(() => Province, (province) => province.tourGuides)
  provinces: Province[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Report, (Report) => Report.tourGuide)
  reports: Report[];

  @OneToMany(() => Post, (post) => post.tourGuide)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.tourGuide)
  comments: Comment[];

  @OneToMany(() => Voucher, (vourcher) => vourcher.tourGuideCreated)
  vourchers: Voucher[];

  @OneToMany(() => Tour, (tour) => tour.tourGuide)
  tours: Tour[];
  // Task cho anh Hảo: 1 HDV có thể hoạt động ở nhiều tỉnh

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.tourGuide)
  userFavorites: UserFavorite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
