import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Participant } from './participant.entity';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant_1_id' })
  participant1: Participant;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant_2_id' })
  participant2: Participant;

  @Column()
  message: string;

  @CreateDateColumn()
  created_at: Date;
}
