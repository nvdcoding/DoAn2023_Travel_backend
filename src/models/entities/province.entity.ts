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

  @ManyToMany(() => TourGuide, (tourGuide) => tourGuide.provinces)
  tourGuides: TourGuide[];

  @OneToMany(() => UserFavorite, (userFavorite) => userFavorite.province)
  userFavorites: UserFavorite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
