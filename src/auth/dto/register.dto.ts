import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    @ApiProperty()
    name: string;

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
