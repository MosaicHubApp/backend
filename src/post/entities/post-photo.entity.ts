import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PostPhoto {
  @PrimaryGeneratedColumn()
  post_photo_id: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'post_id' })
  post?: Post;

  @Column({ length: 500 })
  photo_url: string;

  @Column({ length: 500, default: '' })
  file_name: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;

  @Column()
  order_number: number;

  @CreateDateColumn()
  created_at: Date;
}
