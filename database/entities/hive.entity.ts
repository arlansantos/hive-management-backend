import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Apiary } from './apiary.entity';

@Entity('hives')
export class Hive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'apiary_id', type: 'uuid' })
  apiaryId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'last_read', type: 'timestamp', nullable: true })
  lastRead: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Apiary, (apiary) => apiary.hives, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apiary_id' })
  apiary: Apiary;
}
