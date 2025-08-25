import {Injectable, BadRequestException, UnauthorizedException, ConflictException} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {
    HASH_COST_FACTOR,
    VERIFICATION_CODE_EXPIRATION_TIME_SECONDS, VERIFICATION_CODE_MIN_VALIDITY_THRESHOLD_SECONDS,
    VERIFICATION_SESSION_EXPIRATION_TIME_DAYS
} from "./auth.constants";
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
import {LoginDto} from "./dto/login.dto";

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
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(dto.password, HASH_COST_FACTOR);
        const user = await this.userService.create(dto.name, dto.email, hashedPassword);
        await this.sendNewVerificationCode(dto.email, user.user_id);
        return this.generateToken(user);
    }

    private async sendNewVerificationCode(email: string, userId: number) {
        const expirationDate = new Date(Date.now() - (VERIFICATION_CODE_EXPIRATION_TIME_SECONDS - VERIFICATION_CODE_MIN_VALIDITY_THRESHOLD_SECONDS) * 1000)
        const lastVerificationSession = await this.verificationSessionRepository.findOne({
            where: { user: { user_id: userId }, is_verified: false, created_at: MoreThanOrEqual(expirationDate) },
            order: { created_at: 'DESC' }
        })
        if(lastVerificationSession) {
            return;
        }
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const verificationMailHtmlWithCode = VERIFICATION_MAIL_HTML.replace(VERIFICATION_CODE_PLACEHOLDER, verificationCode);
        const verificationMailTextWithCode = VERIFICATION_MAIL_TEXT.replace(VERIFICATION_CODE_PLACEHOLDER, verificationCode);
        await this.emailService.sendEmail(email, VERIFICATION_MAIL_TITLE, verificationMailTextWithCode, verificationMailHtmlWithCode);
        await this.createVerificationSession(userId, verificationCode);
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        const unauthorizedException = new UnauthorizedException('Invalid credentials');
        if (!user) {
            throw unauthorizedException;
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw unauthorizedException;
        }
        const verificationSession = await this.verificationSessionRepository.findOne({
            where: { user, is_verified: true  },
            order: { created_at: 'DESC' }
        })
        const expirationDate = new Date(Date.now() - VERIFICATION_SESSION_EXPIRATION_TIME_DAYS * 24 * 60 * 60 * 1000)
        if(!verificationSession || verificationSession!.created_at < expirationDate) {
            await this.sendNewVerificationCode(user.email, user.user_id);
        }
        return this.generateToken(user);
    }

    private createVerificationSession(user_id: number, verification_code: string) {
        const verificationSession = this.verificationSessionRepository.create({user: { user_id }, verification_code, is_verified: false});
        return this.verificationSessionRepository.save(verificationSession);
    }

    async generateToken(user: User) {
        const payload = { sub: user.user_id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async verifyEmail(userId: number, verificationCode: string) {
        const expirationDate = new Date(Date.now() - VERIFICATION_CODE_EXPIRATION_TIME_SECONDS * 1000);
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
        await this.userService.verifyStudentEmail(userId);
    }

    async resendVerificationCode(userId: number) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const verificationSession = await this.verificationSessionRepository.findOne({
            where: { user: { user_id: userId }, is_verified: false },
        })
        if(!verificationSession) {
            throw new BadRequestException('Email already verified');
        }
        return this.sendNewVerificationCode(user.email, userId);
    }

    async changeEmail(userId: number, newEmail: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const existingUser = await this.userService.findByEmail(newEmail);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        await this.userService.updateEmail(userId, newEmail);
        await this.verificationSessionRepository
            .createQueryBuilder()
            .delete()
            .where('user_id = :userId', { userId })
            .execute();
        return this.sendNewVerificationCode(user.email, userId);
    }
}
