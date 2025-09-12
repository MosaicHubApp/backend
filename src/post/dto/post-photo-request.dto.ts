import { IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostPhotoRequestDto {
  @ApiProperty()
  @Min(0)
  @Type(() => Number)
  orderNumber: number;

  @IsOptional()
  @ApiProperty()
  @Min(0)
  @Type(() => Number)
  postId?: number;
}