import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationMapper {
  notificationToDto(notification: Notification): NotificationDto {
    return {
      id: notification.notification_id,
      postId: notification.post.post_id,
      type: notification.type,
      isRead: notification.is_read,
      createdAt: notification.created_at,
    }
  }
}