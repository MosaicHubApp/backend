import {IsEmail, IsNotEmpty, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RequestPasswordResetDto {
    @IsEmail()
    @MaxLength(500)
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}
