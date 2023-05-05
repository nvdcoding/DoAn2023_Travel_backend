import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'tourGuideId', type: 'int', nullable: false })
  tourGuideId: number;

  @Column({ name: 'message', type: 'text', nullable: false })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
