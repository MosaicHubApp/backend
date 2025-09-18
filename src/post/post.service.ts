import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Like, Not, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { TagCategory } from './entities/tag-category.entity';
import { PostPhoto } from './entities/post-photo.entity';
import { TagsResponseDto } from './dto/tags-response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostMapper } from './post.mapper';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostPhotosReorderRequestDto } from './dto/post-photos-reorder-request.dto';
import { deleteFile } from '../common/utils/file.util';
import { POST_AUTO_CLOSE_DAYS, POST_PHOTOS_DIRECTORY } from './post.constants';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(TagCategory)
    private tagCategoryRepository: Repository<TagCategory>,
    @InjectRepository(PostPhoto)
    private postPhotoRepository: Repository<PostPhoto>,
    private postMapper: PostMapper,
  ) {}

  async getTags(name: string | null): Promise<TagsResponseDto> {
    const categories = await this.tagCategoryRepository.find({
      relations: ['tags'],
      where: {
        tags: { tag_name: Like(`%${name ?? ''}%`) },
      },
    });
    return {
      categories: categories.map((category) =>
        this.postMapper.tagCategoryToDto(category),
      ),
    };
  }

  async createPost(userId: number, dto: CreatePostDto) {
    if (dto.tagIds.length === 0) {
      throw new BadRequestException('Tags are required');
    }
    const post = await this.postRepository.save({
      author: { user_id: userId },
      title: dto.title,
      description: dto.description,
      tags: dto.tagIds.map((tagId) => ({ tag_id: tagId })),
    });
    const notMyPhotosCount = await this.postPhotoRepository.count({
      where: {
        uploader: { user_id: Not(userId) },
        post_photo_id: In(dto.photoIds),
      },
    });
    if (notMyPhotosCount > 0) {
      throw new BadRequestException('Some photos do not belong to you');
    }
    await this.postPhotoRepository.update(
      { post_photo_id: In(dto.photoIds) },
      { post },
    );
    const resultPost = await this.postRepository.findOne({
      where: { post_id: post.post_id },
      relations: ['author', 'post_photos', 'tags'],
    });
    return this.postMapper.postToDto(resultPost!);
  }

  async uploadPostPhoto(
    userId: number,
    serverUrl: string,
    path: string,
    filename: string,
    orderNumber: number,
    postId?: number,
  ) {
    if (postId) {
      const isPostExists = await this.postRepository.exists({
        where: { post_id: postId, author: { user_id: userId } },
      })
      if(!isPostExists) {
        throw new BadRequestException('Post not found or not owned by user');
      }
    }
    const postPhoto = await this.postPhotoRepository.save({
      uploader: { user_id: userId },
      file_name: filename,
      photo_url: `${serverUrl}/${path}`,
      order_number: orderNumber,
      post: postId ? { post_id: postId } : undefined,
    });
    return this.postMapper.postPhotoToDto(postPhoto);
  }

  async updatePost(userId: number, postId: number, dto: UpdatePostDto) {
    const updateResult = await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        title: dto.title,
        description: dto.description,
      })
      .where('post.post_id = :postId', { postId })
      .andWhere('post.author_id = :userId', { userId })
      .execute();

    if (!updateResult.affected || updateResult.affected === 0) {
      throw new BadRequestException('Post not found or not owned by user');
    }
    const existingTagIds = await this.postRepository
      .createQueryBuilder()
      .relation(Post, 'tags')
      .of(postId)
      .loadMany<Tag>()
      .then((tags) => tags.map((t) => t.tag_id));

    await this.postRepository
      .createQueryBuilder()
      .relation(Post, 'tags')
      .of(postId)
      .addAndRemove(dto.tagIds, existingTagIds);

    const updatedPost = await this.postRepository.findOne({
      where: { post_id: postId },
      relations: ['author', 'post_photos', 'tags'],
    });
    return this.postMapper.postToDto(updatedPost!);
  }

  async updatePhotosOrder(userId: number, dto: PostPhotosReorderRequestDto) {
    const photos = await this.postPhotoRepository.find({
      where: {
        post: { author: { user_id: userId } },
        post_photo_id: In(dto.photos.map((photo) => photo.id)),
      },
      relations: ['post'],
    });
    if (photos.length !== dto.photos.length) {
      throw new BadRequestException(
        'Some photos not found or not owned by user',
      );
    }
    const postIds = photos.map((photo) => photo.post!.post_id);
    if (!this.areAllValuesSame(postIds)) {
      throw new BadRequestException('Photos belong to different posts');
    }
    for (const photo of dto.photos) {
      await this.postPhotoRepository.update(
        {
          post_photo_id: photo.id,
        },
        {
          order_number: photo.orderNumber,
        },
      );
    }
    const updatedPhotos = await this.postPhotoRepository.find({
      where: { post_photo_id: In(dto.photos.map((photo) => photo.id)) },
    });
    return updatedPhotos.map(this.postMapper.postPhotoToDto);
  }

  private areAllValuesSame(arr: number[]): boolean {
    return arr.every((val) => val === arr[0]);
  }

  async deletePhoto(userId: number, photoId: number) {
    const photo = await this.postPhotoRepository.findOne({
      where: {
        post_photo_id: photoId,
        uploader: { user_id: userId },
      },
    });
    if (!photo) {
      throw new BadRequestException('Photo not found or not owned by user');
    }
    await this.postPhotoRepository.delete({ post_photo_id: photoId });
    await deleteFile(POST_PHOTOS_DIRECTORY, photo.file_name);
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postRepository.findOne({
      where: { post_id: postId, author: { user_id: userId } },
      relations: ['post_photos'],
    })
    if (!post) {
      throw new BadRequestException('Post not found or not owned by user');
    }
    await this.postRepository.delete(postId);
    await Promise.all(
      post.post_photos.map((photo) =>
        deleteFile(POST_PHOTOS_DIRECTORY, photo.file_name)
      )
    );
  }

  async getPostById(postId: number) {
    const post = await this.postRepository.findOne({
      where: { post_id: postId },
      relations: ['author', 'post_photos', 'tags'],
    })
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.postMapper.postToDto(post);
  }

  async changePostClosedStatus(userId: number, postId: number, isClosed: boolean) {
    const post = await this.postRepository.findOne({
      where: { post_id: postId, author: { user_id: userId } },
      relations: ['author', 'post_photos', 'tags'],
    });
    if (!post) {
      throw new NotFoundException('Post not found or not owned by user');
    }
    if (post.is_closed === isClosed) {
      throw new ConflictException(`Post is already ${isClosed ? 'closed' : 'opened'}`);
    }
    if(!isClosed) {
      post.opened_at = new Date();
    }
    post.is_closed = isClosed;
    await this.postRepository.save(post);
    return this.postMapper.postToDto(post);
  }

  async findExpiredPosts() {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - POST_AUTO_CLOSE_DAYS);
    return this.postRepository.find({
      where: {
        is_closed: false,
        opened_at: LessThan(expiredDate),
      },
      relations: ['author'],
    });
  }

  async closePosts(postIds: number[]) {
    await this.postRepository
      .createQueryBuilder()
      .update()
      .set({ is_closed: true })
      .whereInIds(postIds)
      .execute();
  }
}
