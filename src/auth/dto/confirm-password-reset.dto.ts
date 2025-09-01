import {IsString, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ConfirmPasswordResetDto {
    @IsString()
    @MinLength(6)
    @ApiProperty()
    password: string;

    @IsString()
    @MaxLength(64)
    @ApiProperty()
    token: string;
}
