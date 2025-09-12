import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import {Tag} from "./tag.entity";

@Entity()
export class TagCategory {
    @PrimaryGeneratedColumn()
    tag_category_id: number;

    @OneToMany(() => Tag, tag => tag.tag_category)
    tags: Tag[];

    @Column({ length: 200 })
    tag_category_name: string;
}
