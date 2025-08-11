import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {RegisterDto} from "./dto/register.dto";
import {HASH_COST_FACTOR} from "./auth.constants";
import crypto from 'crypto';
import {EmailService} from "../email/email.service";
import {
    VERIFICATION_CODE_PLACEHOLDER,
    VERIFICATION_MAIL_HTML,
    VERIFICATION_MAIL_TEXT,
    VERIFICATION_MAIL_TITLE
} from "./auth.constants";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {VerificationSession} from "./verification-session.entity";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private emailService: EmailService,
        @InjectRepository(VerificationSession)
        private verificationSessionRepository: Repository<VerificationSession>,
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
        return this.generateToken(user);
    }

    private createVerificationSession(user_id: number, verification_code: string) {
        const verificationSession = this.verificationSessionRepository.create({user: { user_id }, verification_code, is_verified: false});
        return this.verificationSessionRepository.save(verificationSession);
    }

    async generateToken(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
