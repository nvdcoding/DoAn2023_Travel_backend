import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Province } from './province.entity';
import { Tour } from './tour.entity';
import { TourGuide } from './tourguide.entity';
import { User } from './user.entity';

@Entity({ name: 'user_favorite' })
export class UserFavorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userFavorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Province, (province) => province.userFavorites)
  province: Province;

  @ManyToOne(() => Post, (post) => post.userFavorites)
  post: Post;

  @ManyToOne(() => Tour, (tour) => tour.userFavorites)
  tour: Tour;

  @ManyToOne(() => TourGuide, (tourGuide) => tourGuide.userFavorites)
  tourGuide: TourGuide;
}
