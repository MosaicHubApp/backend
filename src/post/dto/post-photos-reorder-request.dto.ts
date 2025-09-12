import { PostPhotoDto } from './post-photo.dto';
import { ArrayUnique, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostPhotosReorderRequestDto {
  @IsNotEmpty()
  @ApiProperty( { type: [PostPhotoDto] })
  @ArrayUnique((photo => photo.orderNumber), { message: 'Order numbers must be unique' })
  photos: PostPhotoDto[];
}