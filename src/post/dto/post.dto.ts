import { UserProfileDto } from '../../user/dto/user-profile.dto';
import { IdNameDto } from '../../common/dto/id-name.dto';
import { PostPhotoWithUrlDto } from './post-photo-with-url.dto';

export class PostDto {
  id: number;
  author: UserProfileDto
  title: string;
  description: string;
  openedAt: Date;
  isClosed: boolean;
  createdAt: Date;
  photos: PostPhotoWithUrlDto[];
  tags: IdNameDto[];
}