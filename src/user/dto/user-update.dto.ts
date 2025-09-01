import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @MaxLength(1000)
  description: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  telegramUsername?: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  instagramUsername?: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(300)
  linkedinUsername?: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  githubUsername?: string;
}
