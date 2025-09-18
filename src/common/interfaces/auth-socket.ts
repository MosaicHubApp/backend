import { Socket } from 'socket.io';
import { WsUserPayload } from './ws-user-payload';

export interface AuthSocket extends Socket {
  data: {
    user: WsUserPayload;
  };
}
