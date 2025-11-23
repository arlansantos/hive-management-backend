import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Apiary } from './apiary.entity';
import { SensorReading } from './sensor-reading.entity';
import { Management } from './management.entity';
import { Alert } from './alert.entity';
import { HiveStatus } from '../../shared/enums/hive-status.enum';

@Entity('hives')
export class Hive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'apiary_id', type: 'uuid' })
  apiaryId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: HiveStatus.ACTIVE,
  })
  status: HiveStatus;

  @Column({
    name: 'last_read',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastRead: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => Apiary, (apiary) => apiary.hives, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apiary_id' })
  apiary: Apiary;

  @OneToMany(() => SensorReading, (sensorReading) => sensorReading.hive)
  sensorReadings: SensorReading[];

  @OneToMany(() => Management, (management) => management.hive)
  managements: Management[];

  @OneToMany(() => Alert, (alert) => alert.hive)
  alerts: Alert[];
}
