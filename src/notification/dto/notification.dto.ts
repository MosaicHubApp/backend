import { NotificationType } from '../enums/notification-type.enum';

export class NotificationDto {
  id: number;
  postId: number;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}