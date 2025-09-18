import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { PostService } from './post.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class PostSchedulerService {

  constructor(
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCloseExpiredPosts() {
    const expiredPosts = await this.postService.findExpiredPosts()
    if (expiredPosts.length === 0) {
      return;
    }
    const postIds = expiredPosts.map(post => post.post_id);
    await this.postService.closePosts(postIds)
    await this.notificationService.createPostExpiredNotifications(postIds);
    expiredPosts.forEach((post) => {
      this.notificationGateway.emitNewNotificationEvent(post.author.user_id);
    })
  }
}
