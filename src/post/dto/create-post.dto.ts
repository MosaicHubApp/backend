import { ApiProperty } from '@nestjs/swagger';
import { UpdatePostDto } from './update-post.dto';

export class CreatePostDto extends UpdatePostDto  {
  @ApiProperty({ type: [Number] })
  photoIds: number[];
}