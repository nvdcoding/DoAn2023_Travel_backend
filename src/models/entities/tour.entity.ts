import { UserFavorite } from './user_favorite.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Province } from './province.entity';
import { Rate } from './rate.entity';
import { TourGuide } from './tourguide.entity';
import { TourSchedule } from './tour_schedule.entity';
import { TourStatus, TourTypes } from 'src/shares/enum/tour.enum';
import { TourImage } from './tour-image.entity';

@Entity({ name: 'tours' })
export class Tour extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'name' })
  name: string;

  @Column({ nullable: false, name: 'description', type: 'longtext' })
  description: string;

  @Column({ name: 'base_price', default: 0, type: 'bigint', nullable: false })
  basePrice: number;

  @Column({ name: 'max_price', default: 0, type: 'bigint', nullable: false })
  maxPrice: number;

  @Column({ name: 'max_member', default: 0, type: 'bigint', nullable: false })
  maxMember: number;

  @Column({
    name: 'num_of_free_member',
    default: 0,
    type: 'int',
    nullable: false,
  })
  numOfFreeMember: number;

  @Column({
    name: 'fee_per_member',
    default: 0,
    type: 'bigint',
    nullable: false,
  })
  feePerMember: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TourStatus,
    default: TourStatus.INACTIVE,
    nullable: false,
  })
  status: TourStatus;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TourTypes,
    default: TourTypes.ECO_TOURISM,
    nullable: false,
  })
  type: TourTypes;

  @ManyToOne(() => Province, (province) => province.tours)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @OneToMany(() => Rate, (rate) => rate.tour)
  rates: Rate[];

  @OneToMany(() => TourSchedule, (tourSchedule) => tourSchedule.tour, {
    cascade: true,
  })
  tourSchedule: TourSchedule[];

  @OneToMany(() => Order, (order) => order.tour)
  orders: Order[];

  @OneToMany(() => TourImage, (tourImage) => tourImage.tour, { cascade: true })
  images: TourImage[];

  //many to one
  @ManyToOne(() => TourGuide, (tourGuide) => tourGuide.tours)
  tourGuide: TourGuide;

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.tour)
  userFavorites: UserFavorite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
