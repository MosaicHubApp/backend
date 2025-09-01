import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { InterestSubcategory } from './interest-subcategory.entity';

@Entity()
export class Interest {
  @PrimaryGeneratedColumn()
  interest_id: number;

  @Column({length: 100})
  name: string;

  @ManyToMany(() => User, (user) => user.interests)
  users: User[];

  @ManyToOne(() => InterestSubcategory, (interestSubcategory) => interestSubcategory.interests)
  interest_subcategory: InterestSubcategory;
}
