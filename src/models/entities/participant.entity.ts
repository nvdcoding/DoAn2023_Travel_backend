import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Chat } from './chat.entity';
import { TourGuide } from './tourguide.entity';
import { User } from './user.entity';

@Entity({ name: 'participant' })
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => TourGuide)
  @JoinColumn()
  tourguide: TourGuide;

  @OneToMany(() => Chat, (chat) => chat.participant1)
  chat1: Chat[];

  @OneToMany(() => Chat, (chat) => chat.participant2)
  chat2: Chat[];
}
