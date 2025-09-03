import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {Post} from "./post.entity";

@Entity()
export class PostPhoto {
    @PrimaryGeneratedColumn()
    post_photo_id: number;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column({ length: 500 })
    photo_url: string;

    @Column()
    order_number: number;

    @CreateDateColumn()
    created_at: Date;
}
