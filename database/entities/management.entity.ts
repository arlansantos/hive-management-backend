import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hive } from './hive.entity';
import { User } from './user.entity';

@Entity('management')
export class Management {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hive_id', type: 'uuid' })
  hiveId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date' })
  date: Date;

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
