import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { UserMapper } from '../user/user.mapper';
import { PostDto } from './dto/post.dto';
import { IdNameDto } from '../common/dto/id-name.dto';
import { Tag } from './tag.entity';
import { TagCategory } from './tag-category.entity';
import { TagCategoryDto } from './dto/tag-category.dto';
import { PostPhoto } from './post-photo.entity';
import { PostPhotoWithUrlDto } from './dto/post-photo-with-url.dto';

@Injectable()
export class PostMapper {
  constructor(
    private userMapper: UserMapper,
  ) {}

  postToDto(post: Post): PostDto {
    return {
      id: post.post_id,
      author: this.userMapper.userToDto(post.author),
      title: post.title,
      description: post.description,
      openedAt: post.opened_at,
      isClosed: post.is_closed,
      createdAt: post.created_at,
      photos: post.post_photos
        .sort((a, b) => a.order_number - b.order_number)
        .map(this.postPhotoToDto),
      tags: post.tags.map(this.tagToDto),
    }
  }

  tagToDto(tag: Tag): IdNameDto {
    return new IdNameDto(tag.tag_id, tag.tag_name);
  }

  tagCategoryToDto(tagCategory: TagCategory): TagCategoryDto {
    return {
      categoryName: tagCategory.tag_category_name,
      tags: tagCategory.tags.map(this.tagToDto)
    }
  }

  postPhotoToDto(photo: PostPhoto): PostPhotoWithUrlDto {
    return {
      id: photo.post_photo_id,
      url: photo.photo_url,
      orderNumber: photo.order_number
    }
  }
}