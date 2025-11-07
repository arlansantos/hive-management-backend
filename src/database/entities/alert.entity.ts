import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hive } from './hive.entity';
import { AlertType } from 'src/shared/enums/alert-type.enum';
import { AlertSeverity } from 'src/shared/enums/alert-severity.enum';
import { AlertStatus } from 'src/shared/enums/alert-status.enum';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hive_id', type: 'uuid' })
  hiveId: string;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  type: AlertType;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.NEW,
  })
  status: AlertStatus;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;

  @ManyToOne(() => Hive, (hive) => hive.alerts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hive_id' })
  hive: Hive;
}
