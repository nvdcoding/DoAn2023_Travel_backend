import { ReportStatus } from 'src/shares/enum/report.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Post } from './post.entity';
import { TourGuide } from './tourguide.entity';
import { User } from './user.entity';

@Entity({ name: 'reports' })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  // report:
  @ManyToOne(() => Post, (post) => post.reports)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Order, (order) => order.reports)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'reported_by' })
  reportedBy: User;

  @Column({
    type: 'enum',
    name: 'status',
    nullable: false,
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ name: 'meeting_date', type: 'date', nullable: true })
  meetingDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
