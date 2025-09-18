import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationMapper } from './notification.mapper';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), forwardRef(() => AuthModule),],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationMapper, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
