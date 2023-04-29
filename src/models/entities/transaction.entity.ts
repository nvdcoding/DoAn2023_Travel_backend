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
import { User } from './user.entity';
import { TransactionStatus } from 'src/shares/enum/transaction.enum';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'name' })
  name: string;

  @Column({
    name: 'amount',
    default: 0,
    type: 'bigint',
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
  })
  status: TransactionStatus;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
