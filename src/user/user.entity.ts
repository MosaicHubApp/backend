import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {VerificationSession} from "../auth/verification-session.entity";

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
    is_verified: boolean;

    @Column({length: 1000, default: ""})
    description: string;

    @OneToMany(() => VerificationSession, (verificationSession) => verificationSession.user)
    verification_sessions: [VerificationSession];
}
