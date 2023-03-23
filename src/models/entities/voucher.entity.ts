import { ReportStatus } from 'src/shares/enum/report.enum';
import { DiscountType, VoucherType } from 'src/shares/enum/voucher.enum';
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
import { UserVoucher } from './user_voucher.entity';

@Entity({ name: 'vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
  })
  code: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: VoucherType,
    nullable: false,
  })
  type: VoucherType;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: DiscountType,
    nullable: false,
  })
  discountType: DiscountType;

  @Column({
    name: 'requirement_price',
    type: 'bigint',
    default: 0,
    nullable: false,
  })
  requirementPrice: number;

  @ManyToOne(() => TourGuide, (tourGuide) => tourGuide.vourchers)
  @JoinColumn({ name: 'tuor_guide_created' })
  tourGuideCreated: TourGuide;

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.voucher)
  userVouchers: UserVoucher[];

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: Date;

  @Column({
    type: 'enum',
    name: 'status',
    nullable: false,
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
