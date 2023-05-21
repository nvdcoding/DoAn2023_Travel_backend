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
@Entity({ name: 'tour_schedule' })
export class TourSchedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'content' })
  content: string;

  @Column({ nullable: false, name: 'image' })
  image: string;

  @Column({ nullable: false, name: 'title' })
  title: string;

  @ManyToOne(() => Tour, (tour) => tour.tourSchedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tour_id' })
  tour: Tour;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
