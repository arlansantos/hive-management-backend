import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Apiary } from './apiary.entity';

@Entity('harvests')
export class Harvest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'apiary_id', type: 'uuid' })
  apiaryId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    name: 'honey_weight',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  honeyWeight: number;

  @Column({
    name: 'wax_weight',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  waxWeight: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Apiary, (apiary) => apiary.harvests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apiary_id' })
  apiary: Apiary;

  @ManyToOne(() => User, (user) => user.harvests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
