import { PostStatus, Topics } from 'src/shares/enum/post.enum';
import { UserStatus } from 'src/shares/enum/user.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Report } from './report.entity';
import { TourGuide } from './tourguide.entity';
import { User } from './user.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, name: 'title' })
  title: string;

  @Column({ nullable: false, name: 'content', type: 'text' })
  content: string;

  // author
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TourGuide, (tuorGuide) => tuorGuide.posts)
  @JoinColumn({ name: 'tour_guide_id' })
  tourGuide: TourGuide;

  @OneToMany(() => Comment, (Comment) => Comment.post)
  comments: Comment[];

  @OneToMany(() => Report, (Report) => Report.post)
  reports: Report[];

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'image',
  })
  image: string;

  @Column({
    nullable: false,
    name: 'topics',
    type: 'enum',
    enum: Topics,
  })
  topic: Topics;

  @Column({
    nullable: false,
    name: 'status',
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.INACTIVE,
  })
  status: PostStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
