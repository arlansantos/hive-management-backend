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
import { AlertType } from '../../shared/enums/alert-type.enum';
import { AlertSeverity } from '../../shared/enums/alert-severity.enum';
import { AlertStatus } from '../../shared/enums/alert-status.enum';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hive_id', type: 'uuid' })
  hiveId: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  type: AlertType;

  @Column({
    type: 'varchar',
    length: 100,
  })
  severity: AlertSeverity;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: AlertStatus.NEW,
  })
  status: AlertStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Hive, (hive) => hive.alerts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hive_id' })
  hive: Hive;
}
