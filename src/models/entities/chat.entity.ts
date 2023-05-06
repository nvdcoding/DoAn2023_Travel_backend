import { TourGuide } from './tourguide.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('int', { name: 'tour_guide_id' })
  tourGuideId: number;

  // @ManyToOne(() => User)
  // @JoinColumn({ referencedColumnName: 'id' })
  // user: User;

  // @ManyToOne(() => TourGuide)
  // @JoinColumn({ referencedColumnName: 'id' })
  // tourGuide: TourGuide;

  @Column()
  sender: 'user' | 'tour_guide';

  @Column()
  message: string;

  @CreateDateColumn()
  created_at: Date;
}
