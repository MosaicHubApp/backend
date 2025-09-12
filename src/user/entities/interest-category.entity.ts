import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { InterestSubcategory } from './interest-subcategory.entity';

@Entity()
export class InterestCategory {
  @PrimaryGeneratedColumn()
  interest_category_id: number;

  @Column({length: 100})
  name: string;

  @OneToMany(() => InterestSubcategory, (interestSubcategory) => interestSubcategory.interest_category)
  interest_subcategories: InterestSubcategory[];
}
