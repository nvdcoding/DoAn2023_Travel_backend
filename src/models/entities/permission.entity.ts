import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'level', type: 'int' })
  level: number;

  @Column({ nullable: false, name: 'posts', type: 'boolean' })
  post: boolean;

  @Column({ nullable: false, name: 'users', type: 'boolean' })
  users: boolean;

  @Column({ nullable: false, name: 'reports', type: 'boolean' })
  reports: boolean;

  @Column({ nullable: false, name: 'tours', type: 'boolean' })
  tours: boolean;

  @Column({ nullable: false, name: 'payments', type: 'boolean' })
  payments: boolean;

  @Column({ nullable: false, name: 'vouchers', type: 'boolean' })
  vouchers: boolean;
}
