import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'admins' })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
  })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.MOD,
    name: 'role',
    nullable: false,
  })
  role: AdminRole;

  @Column({
    enum: AdminStatus,
    type: 'enum',
    name: 'status',
    nullable: false,
    default: AdminStatus.INACTIVE,
  })
  status: AdminStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
