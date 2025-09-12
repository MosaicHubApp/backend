import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {User} from "../../user/entities/user.entity";

@Entity()
export class PasswordResetSession {
    @PrimaryGeneratedColumn()
    password_reset_session_id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ unique: true, length: 64 })
    password_reset_token: string;

    @Column({ default: false })
    is_used: boolean;

    @CreateDateColumn()
    created_at: Date;
}
