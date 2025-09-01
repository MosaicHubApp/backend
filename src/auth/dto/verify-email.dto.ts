import {IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class VerifyEmailDto {
    @IsString()
    @MaxLength(6)
    @MinLength(6)
    @ApiProperty()
    verificationCode: string;
}
