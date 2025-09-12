import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { EmailVerificationSession } from '../../auth/entities/email-verification-session.entity';
import { PasswordResetSession } from '../../auth/entities/password-reset-session.entity';
import { Interest } from './interest.entity';
import { BannedUser } from './banned-user.entity';
import { Post } from '../../post/entities/post.entity';
import { PostPhoto } from '../../post/entities/post-photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 500 })
  email: string;

  @Column({ length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  photo_url: string | null;

  @Column({ default: false })
  is_verified_student: boolean;

  @Column({ length: 1000, default: '' })
  description: string;

  @Column({ nullable: true, unique: true, length: 100 })
  telegram_username?: string;

  @Column({ nullable: true, unique: true, length: 100 })
  instagram_username?: string;

  @Column({ nullable: true, unique: true, length: 300 })
  linkedin_username?: string;

  @Column({ nullable: true, unique: true, length: 100 })
  github_username?: string;

  @OneToMany(
    () => EmailVerificationSession,
    (verificationSession) => verificationSession.user,
  )
  verification_sessions: [EmailVerificationSession];

  @OneToMany(
    () => PasswordResetSession,
    (passwordChangeSession) => passwordChangeSession.user,
  )
  password_change_sessions: [PasswordResetSession];

  @ManyToMany(() => Interest, (interest) => interest.users)
  @JoinTable()
  interests: Interest[];

  @OneToMany(() => BannedUser, (banned_user) => banned_user.banned_by_user)
  banned_by_users: BannedUser[];

  @OneToMany(() => BannedUser, (banned_user) => banned_user.banned_user)
  banned_users: BannedUser[];

  @OneToMany(() => PostPhoto, (postPhoto) => postPhoto.uploader)
  post_photos: PostPhoto[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
