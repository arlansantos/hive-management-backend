import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Apiary } from './apiary.entity';

@Entity('user_apiaries')
export class UserApiary {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'apiary_id', type: 'uuid' })
  apiaryId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userApiaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Apiary, (apiary) => apiary.userApiaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apiary_id' })
  apiary: Apiary;
}
