import { UserStatus } from 'src/shares/enum/user.enum';
import { WALLET_TYPE } from 'src/shares/enum/wallet.enum';
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
import { User } from './user.entity';

@Entity({ name: 'wallets' })
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true, name: 'address' })
  address: string;

  @Column({
    nullable: false,
    name: 'wallet_type',
    type: 'enum',
    enum: WALLET_TYPE,
    default: WALLET_TYPE.VN_PAY,
  })
  walletType: WALLET_TYPE;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
