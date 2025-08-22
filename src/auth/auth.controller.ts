import { Controller, Post, Body, Put, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('verify-email')
    async verifyEmail(@Request() req, @Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(req.user.userId, dto.verificationCode);
    }
}