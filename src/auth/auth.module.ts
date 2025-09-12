import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import {JWT_EXPIRATION_TIME} from "./auth.constants";
import {EmailModule} from "../email/email.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmailVerificationSession} from "./entities/email-verification-session.entity";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {PasswordResetSession} from "./entities/password-reset-session.entity";

@Module({
  imports: [
    UserModule,
    PassportModule,
    EmailModule,
    TypeOrmModule.forFeature([EmailVerificationSession, PasswordResetSession]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: JWT_EXPIRATION_TIME },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}