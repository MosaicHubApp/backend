import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Interest } from './interest.entity';
import { InterestCategory } from './interest-category.entity';

@Entity()
export class InterestSubcategory {
  @PrimaryGeneratedColumn()
  interest_subcategory_id: number;

  @Column({length: 100})
  name: string;

  @OneToMany(() => Interest, (interest) => interest.interest_subcategory)
  interests: Interest[];

  @ManyToOne(() => InterestCategory, (interestCategory) => interestCategory.interest_subcategories)
  interest_category: InterestCategory;
}
