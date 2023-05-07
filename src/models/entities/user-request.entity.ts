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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from './post.entity';
import { Province } from './province.entity';
import { Tour } from './tour.entity';
import { TourGuide } from './tourguide.entity';
import { User } from './user.entity';

@Entity({ name: 'user_requests' })
export class UserRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // report:
  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Province, (province) => province.requests)
  @JoinColumn({ name: 'province_id' })
  province: TourGuide;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
