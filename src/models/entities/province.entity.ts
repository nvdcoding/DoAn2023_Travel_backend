import { UserFavorite } from './user_favorite.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TourGuide } from './tourguide.entity';
import { Tour } from './tour.entity';

@Entity({ name: 'provinces' })
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, name: 'name' })
  name: string;

  @Index()
  @Column({ nullable: false, name: 'slug' })
  slug: string;

  @Column({ nullable: false, name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'num_of_favorites', default: 0, type: 'integer' })
  numOfFavorites: number;

  @Column({
    name: 'images',
    default:
      'https://vcdn1-dulich.vnecdn.net/2022/09/15/7-1663171465-1663175328.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=OV0imVDRO8xJKWGk7TRIJQ',
    type: 'varchar',
  })
  images: string;

  @ManyToMany(() => TourGuide, (tourGuide) => tourGuide.provinces)
  tourGuides: TourGuide[];

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.province)
  userFavorites: UserFavorite[];

  @OneToMany(() => Tour, (tour) => tour.province)
  tours: Tour[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
