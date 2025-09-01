import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['banned_user', 'banned_by_user'])
export class BannedUser {
  @PrimaryGeneratedColumn()
  user_id: number;

  @ManyToOne(() => User, (user) => user.banned_users, { onDelete: 'CASCADE' })
  banned_user: User;

  @ManyToOne(() => User, (user) => user.banned_by_users, { onDelete: 'CASCADE' })
  banned_by_user: User;
}