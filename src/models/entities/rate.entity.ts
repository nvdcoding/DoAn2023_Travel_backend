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
import { Tour } from './tour.entity';

@Entity({ name: 'rates' })
export class Rate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'content' })
  content: string;

  @Column({ name: 'star', default: 0, type: 'integer' })
  star: number;

  @ManyToOne(() => Tour, (tour) => tour.rates)
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
