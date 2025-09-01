import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @IsEmail()
    @MaxLength(500)
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty()
    password: string;
}
