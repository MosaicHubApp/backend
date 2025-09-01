import {IsEmail, IsNotEmpty, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ChangeEmailDto {
    @IsEmail()
    @MaxLength(500)
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}
