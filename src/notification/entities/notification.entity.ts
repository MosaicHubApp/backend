import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {Post} from "../../post/entities/post.entity";
import {NotificationType} from "../enums/notification-type.enum";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    notification_id: number;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column({ type: "enum", enum: NotificationType })
    type: NotificationType;

    @Column({ default: false})
    is_read: boolean;

    @CreateDateColumn()
    created_at: Date;
}
