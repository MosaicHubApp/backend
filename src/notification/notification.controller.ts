import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import type { UserRequest } from '../common/interfaces/user.request';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  getNotifications(@Req() req: UserRequest, @Query('limit') limit: number = 20, @Query('offset') offset: number = 0) {
    return this.notificationService.getNotifications(req.user.userId, limit, offset);
  }

  @Get('unread-count')
  getNotificationUnreadCount(@Req() req: UserRequest) {
    return this.notificationService.getNotificationUnreadCount(req.user.userId);
  }
}