import { Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostPhotoDto {
  @Min(1)
  @ApiProperty()
  id: number;

  @Min(0)
  @ApiProperty()
  orderNumber: number;
}