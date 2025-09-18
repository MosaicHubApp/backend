import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException('No token provided (WS)');
    }

    try {
      const payload = this.jwtService.verify<{sub: number}>(token);
      client.data.user = {
        userId: payload.sub,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token (WS)');
    }
  }

  private extractToken(client: Socket): string | undefined {
    if (client.handshake.auth && client.handshake.auth.token) {
      return String(client.handshake.auth.token);
    }

    if (client.handshake.query && client.handshake.query.token) {
      const t = client.handshake.query.token;
      return Array.isArray(t) ? t[0] : String(t);
    }

    const authHeader = client.handshake.headers?.authorization as string | undefined;
    const prefix = 'Bearer ';
    if (authHeader && authHeader.startsWith(prefix)) {
      return authHeader.slice(prefix.length);
    }

    return undefined;
  }
}
