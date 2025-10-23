import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hive } from './hive.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hive_id', type: 'uuid' })
  hiveId: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;

  @ManyToOne(() => Hive, (hive) => hive.alerts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hive_id' })
  hive: Hive;
}
