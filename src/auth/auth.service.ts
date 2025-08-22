import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {HASH_COST_FACTOR, VERIFICATION_CODE_EXPIRATION_TIME_SECONDS} from "./auth.constants";
import crypto from 'crypto';
import {EmailService} from "../email/email.service";
import {
    VERIFICATION_CODE_PLACEHOLDER,
    VERIFICATION_MAIL_HTML,
    VERIFICATION_MAIL_TEXT,
    VERIFICATION_MAIL_TITLE
} from "./auth.constants";
import {InjectRepository} from "@nestjs/typeorm";
import {MoreThanOrEqual, Repository} from "typeorm";
import {EmailVerificationSession} from "./email-verification-session.entity";
import {User} from "../user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private emailService: EmailService,
        @InjectRepository(EmailVerificationSession)
        private verificationSessionRepository: Repository<EmailVerificationSession>,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.userService.findByEmail(dto.email);
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(dto.password, HASH_COST_FACTOR);
        const user = await this.userService.create(dto.name, dto.email, hashedPassword);
        const verificationMailHtmlWithCode = VERIFICATION_MAIL_HTML.replace(VERIFICATION_CODE_PLACEHOLDER, verificationCode);
        const verificationMailTextWithCode = VERIFICATION_MAIL_TEXT.replace(VERIFICATION_CODE_PLACEHOLDER, verificationCode);
        await this.emailService.sendEmail(dto.email, VERIFICATION_MAIL_TITLE, verificationMailTextWithCode, verificationMailHtmlWithCode);
        await this.createVerificationSession(user.user_id, verificationCode);
        return this.generateToken(user);
    }

    private createVerificationSession(user_id: number, verification_code: string) {
        const verificationSession = this.verificationSessionRepository.create({user: { user_id }, verification_code, is_verified: false});
        return this.verificationSessionRepository.save(verificationSession);
    }

    async generateToken(user: User) {
        const payload = { sub: user.user_id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async verifyEmail(userId: number, verificationCode: string) {
        const expirationDate = new Date(Date.now() - VERIFICATION_CODE_EXPIRATION_TIME_SECONDS * 1000);
        console.log("This is user id " + userId);
        const verificationSession = await this.verificationSessionRepository.findOne({
            where: { user: { user_id: userId }, verification_code: verificationCode, is_verified: false, created_at: MoreThanOrEqual(expirationDate)  },
        })
        if (!verificationSession) {
            throw new BadRequestException('Invalid or expired verification code');
        }
        verificationSession.is_verified = true;
        await this.verificationSessionRepository.save(verificationSession);
        await this.verificationSessionRepository
            .createQueryBuilder()
            .delete()
            .where('user_id = :userId AND is_verified = false', { userId })
            .execute();
    }
}
