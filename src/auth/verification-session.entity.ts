import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {User} from "../user/user.entity";

@Entity()
export class VerificationSession {
    @PrimaryGeneratedColumn()
    verification_session_id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ length: 6 })
    verification_code: string;

    @Column()
    is_verified: boolean;

    @CreateDateColumn()
    created_at: Date;
}
