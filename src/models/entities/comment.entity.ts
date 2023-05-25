import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { TourGuide } from './tourguide.entity';
import { User } from './user.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  // author comment
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TourGuide, (tourGuide) => tourGuide.comments)
  @JoinColumn({ name: 'tour_guide_id' })
  tourGuide: TourGuide;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.subcomments)
  @JoinColumn({ name: 'parrent_comment' })
  parrentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parrentComment)
  subcomments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
