import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany
} from 'typeorm';
import {Post} from "./post.entity";
import {TagCategory} from "./tag-category.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    tag_id: number;

    @ManyToMany(() => Post, post => post.tags, { onDelete: 'CASCADE' })
    posts: Post[];

    @Column({ length: 200 })
    tag_name: string;

    @ManyToOne(() => TagCategory, tagCategory => tagCategory.tags, { onDelete: 'CASCADE' })
    tag_category: TagCategory;
}
