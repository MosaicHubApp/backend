import {
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { AuthSocket } from '../common/interfaces/auth-socket';
import { NEW_NOTIFICATION_EVENT } from './notification.constants';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.FRONTEND_CORS_URL,
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class NotificationGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<number, AuthSocket>();
  handleDisconnect(client: AuthSocket) {
    const user = client.data.user;
    if (user && user.userId) {
      this.userSockets.delete(user.userId);
    }
  }

  @SubscribeMessage('subscribe_notifications')
  handleSubscribe(
    @ConnectedSocket() client: AuthSocket,
  ) {
    const user = client.data.user;
    if (!user || !user.userId) {
      client.disconnect(true);
      return;
    }
    this.userSockets.set(user.userId, client);
    client.emit('subscribed_notifications', { success: true });
  }

  async emitNewNotificationEvent(userId: number) {
    const client = this.userSockets.get(userId);
    if (client) {
      client.emit(NEW_NOTIFICATION_EVENT);
    }
  }
}
