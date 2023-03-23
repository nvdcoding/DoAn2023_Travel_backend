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
import { Order } from './orders.entity';
import { Province } from './province.entity';
import { Rate } from './rate.entity';
import { TourGuide } from './tourguide.entity';
import { TourSchedule } from './tour_schedule.entity';

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

  @OneToOne(() => Province)
  @JoinColumn()
  provice: Province;

  @OneToMany(() => Rate, (rate) => rate.tour)
  rates: Rate[];

  @OneToMany(() => TourSchedule, (tourSchedule) => tourSchedule.tour)
  tourSchedule: TourSchedule[];

  @OneToMany(() => Order, (order) => order.tours)
  orders: Order[];

  //many to one
  @ManyToOne(() => TourGuide, (tourGuide) => tourGuide.tours)
  tourGuides: TourGuide;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
