import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Hive } from './hive.entity';

@Entity('sensor_readings')
export class SensorReading {
  @PrimaryColumn({ name: 'hive_id', type: 'uuid' })
  hiveId: string;

  @PrimaryColumn({ type: 'timestamp with time zone' })
  timestamp: Date;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ name: 'internal_temperature', type: 'float', nullable: true })
  internalTemperature: number;

  @Column({ name: 'internal_humidity', type: 'float', nullable: true })
  internalHumidity: number;

  @Column({ name: 'external_temperature', type: 'float', nullable: true })
  externalTemperature: number;

  @ManyToOne(() => Hive, (hive) => hive.sensorReadings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hive_id' })
  hive: Hive;
}
