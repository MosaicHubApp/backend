import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @MaxLength(200)
  title: string;

  @IsString()
  @ApiProperty()
  @MaxLength(1500)
  description: string;

  @ApiProperty({ type: [Number] })
  tagIds: number[];
}