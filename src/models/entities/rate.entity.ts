import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Tour } from './tour.entity';

@Entity({ name: 'rates' })
export class Rate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'content' })
  content: string;

  @Column({ nullable: true, name: 'url_image' })
  urlImage: string;

  @Column({ name: 'star', default: 0, type: 'integer' })
  star: number;

  @ManyToOne(() => Tour, (tour) => tour.rates)
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
