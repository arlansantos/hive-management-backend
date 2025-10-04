import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserApiary } from './user-apiary.entity';
import { Hive } from './hive.entity';
import { Harvest } from './harvest.entity';

@Entity('apiaries')
export class Apiary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserApiary, (userApiary) => userApiary.apiary)
  userApiaries: UserApiary[];

  @OneToMany(() => Hive, (hive) => hive.apiary)
  hives: Hive[];

  @OneToMany(() => Harvest, (harvest) => harvest.apiary)
  harvests: Harvest[];
}
