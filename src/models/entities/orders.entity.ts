import { OrderStatus } from 'src/shares/enum/order.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderSchedule } from './order_schedule.entity';
import { Tour } from './tour.entity';
import { TourGuide } from './tourguide.entity';
import { UserVoucher } from './user_voucher.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    nullable: false,
    default: OrderStatus.WAITING,
  })
  status: OrderStatus;

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: Date;

  @Column({ name: 'price', type: 'bigint', nullable: false })
  price: number;

  @Column({ name: 'paid', type: 'bigint', nullable: false })
  paid: number;

  // so nguoi
  @Column({ name: 'size', type: 'int', nullable: false })
  size: number;

  @OneToOne(() => TourGuide)
  @JoinColumn()
  tourGuide: TourGuide;

  @OneToOne(() => UserVoucher)
  @JoinColumn()
  userVoucher: UserVoucher;

  @ManyToOne(() => Tour, (tour) => tour)
  tours: Tour;

  @OneToMany(() => OrderSchedule, (orderSchedule) => orderSchedule.order)
  orderSchedule: OrderSchedule[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}