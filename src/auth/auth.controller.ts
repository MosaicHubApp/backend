import {Controller, Post, Body, Put, UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {ApiBearerAuth} from "@nestjs/swagger";
import {LoginDto} from "./dto/login.dto";
import {ChangeEmailDto} from "./dto/change-email.dto";
import {RequestPasswordResetDto} from "./dto/request-password-reset.dto";
import {ConfirmPasswordResetDto} from "./dto/confirm-password-reset.dto";
import type { UserRequest } from "../interfaces/user.request";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('resend-verification')
    async resendVerificationCode(@Req() req: UserRequest) {
        return this.authService.resendVerificationCode(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('verify-email')
    async verifyEmail(@Req() req: UserRequest, @Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(req.user.userId, dto.verificationCode);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('change-email')
    async changeEmail(@Req() req: UserRequest, @Body() dto: ChangeEmailDto) {
        return this.authService.changeEmail(req.user.userId, dto.email);
    }

    @Post('reset-password/request')
    async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
        return this.authService.requestPasswordReset(dto.email);
    }

    @Put('reset-password/confirm')
    async confirmPasswordReset(@Body() dto: ConfirmPasswordResetDto) {
        return this.authService.confirmPasswordReset(dto.password, dto.token);
    }
}