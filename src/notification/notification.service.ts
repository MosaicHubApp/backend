import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationMapper } from './notification.mapper';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationMapper: NotificationMapper,
  ) {}

  async getNotifications(userId: number, limit: number, offset: number) {
    const notifications = await this.notificationRepository.find({
      where: { post: { author: { user_id: userId } } },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['post'],
    });
    await this.notificationRepository.query(
      `
        UPDATE notification n
        SET is_read = true
        WHERE n.is_read = false
          AND n.post_id IN (
          SELECT p.post_id
          FROM post p
                 INNER JOIN "user" u ON u.user_id = p.author_id
          WHERE u.user_id = $1
        )
      `,
      [userId],
    );
    return notifications.map(this.notificationMapper.notificationToDto);
  }

  async getNotificationUnreadCount(userId: number) {
    return {
      unreadCount: await this.notificationRepository.count({
        where: { is_read: false, post: { author: { user_id: userId } } },
      }),
    };
  }

  async createPostExpiredNotifications(postIds: number[]) {
    const values = postIds.map((postId) => ({
      post: { post_id: postId },
      type: NotificationType.POST_AUTO_CLOSED,
    }));
    await this.notificationRepository.insert(values);
  }
}