import { UserStatus } from 'src/shares/enum/user.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TourGuide } from './tourguide.entity';
import { Wallet } from './wallet.entity';

@Entity({ name: 'provinces' })
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, name: 'name' })
  name: string;

  @Column({ name: 'num_of_favorites', default: 0, type: 'integer' })
  numOfFavorites: number;

  @ManyToMany(() => TourGuide, (tourGuide) => tourGuide.provinces)
  tourGuides: TourGuide[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
