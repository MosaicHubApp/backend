import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostPhoto } from './entities/post-photo.entity';
import { TagCategory } from './entities/tag-category.entity';
import { Tag } from './entities/tag.entity';
import { Notification } from '../notification/entities/notification.entity';
import { PostMapper } from './post.mapper';
import { UserModule } from '../user/user.module';
import { PostSchedulerService } from './post-scheduler.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [PostService, PostMapper, PostSchedulerService],
  controllers: [PostController],
  imports: [
    TypeOrmModule.forFeature([Post, PostPhoto, Tag, TagCategory, Notification]),
    UserModule,
    NotificationModule,
  ],
})
export class PostModule {}
