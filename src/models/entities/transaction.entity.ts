import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import {
  TransactionStatus,
  TransactionType,
} from 'src/shares/enum/transaction.enum';
import { WALLET_TYPE } from 'src/shares/enum/wallet.enum';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'transaction_code', type: 'varchar', nullable: true })
  transactionCode: string;

  @Column({
    type: 'enum',
    enum: WALLET_TYPE,
    name: 'wallet',
    nullable: false,
    default: WALLET_TYPE.VN_PAY,
  })
  wallet: WALLET_TYPE;

  @Column({
    name: 'amount',
    default: 0,
    type: 'int',
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
    name: 'type',
    nullable: false,
  })
  type: TransactionType;

  @Column({
    type: 'datetime',
    name: 'time',
  })
  time: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
