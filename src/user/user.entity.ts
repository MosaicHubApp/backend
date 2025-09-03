import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import {EmailVerificationSession} from "../auth/email-verification-session.entity";
import {PasswordResetSession} from "../auth/password-reset-session.entity";
import { Interest } from './interest.entity';
import {Post} from "../post/post.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({length: 100})
    name: string;

    @Column({ unique: true, length: 500 })
    email: string;

    @Column({ length: 200 })
    password: string;

    @Column({ nullable: true, length: 1000 })
    photo_url?: string;

    @Column({ default: false })
    is_verified_student: boolean;

    @Column({length: 1000, default: ""})
    description: string;

    @OneToMany(() => EmailVerificationSession, (verificationSession) => verificationSession.user)
    verification_sessions: [EmailVerificationSession];

    @OneToMany(() => PasswordResetSession, (passwordChangeSession) => passwordChangeSession.user)
    password_change_sessions: [PasswordResetSession];

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];

    @ManyToMany(() => Interest, (interest) => interest.users)
    @JoinTable()
    interests: Interest[];
}
