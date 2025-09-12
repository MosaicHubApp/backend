import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    ManyToMany, JoinTable
} from 'typeorm';
import {User} from "../../user/entities/user.entity";
import {PostPhoto} from "./post-photo.entity";
import {Notification} from "../../notification/entities/notification.entity";
import {Tag} from "./tag.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    post_id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column({ length: 200 })
    title: string;

    @Column({ length: 1500 })
    description: string;

    @CreateDateColumn()
    opened_at: Date;

    @Column({ default: false })
    is_closed: boolean;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => PostPhoto, (postPhoto) => postPhoto.post)
    post_photos: PostPhoto[];

    @OneToMany(() => Notification, (notification) => notification.post)
    notifications: Notification[];

    @ManyToMany(() => Tag, tag => tag.posts, { onDelete: 'CASCADE' })
    @JoinTable()
    tags: Tag[];
}