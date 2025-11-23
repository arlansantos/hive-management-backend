import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserApiary } from './user-apiary.entity';
import { Management } from './management.entity';
import { Harvest } from './harvest.entity';
import { UserRole } from 'src/shared/enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string | null;

  @Column({ type: 'varchar', length: 50, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => UserApiary, (userApiary) => userApiary.user)
  userApiaries: UserApiary[];

  @OneToMany(() => Management, (management) => management.user)
  managements: Management[];

  @OneToMany(() => Harvest, (harvest) => harvest.user)
  harvests: Harvest[];
}
