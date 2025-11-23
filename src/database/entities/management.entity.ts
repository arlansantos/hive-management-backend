import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hive } from './hive.entity';
import { User } from './user.entity';
import { ManagementType } from '../../shared/enums/management-type.enum';

@Entity('management')
export class Management {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hive_id', type: 'uuid' })
  hiveId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: ManagementType.OTHER,
  })
  type: ManagementType;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Hive, (hive) => hive.managements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hive_id' })
  hive: Hive;

  @ManyToOne(() => User, (user) => user.managements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
