import { TourGuideService } from 'src/modules/tourguide/tour-guide.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redis from 'redis';
import { redisConfig } from 'src/configs/redis.config';
import { createClient } from 'redis';
import { Emitter } from '@socket.io/redis-emitter';
import { ChatService } from './chat.service';
import { ActorRole } from 'src/shares/enum/auth.enum';

@WebSocketGateway(8001, { cors: '*', path: '/chat' })
export class ChatGateWay {
  @WebSocketServer()
  server: Server;
  public io;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly tourGuideService: TourGuideService,
  ) {
    const redisClient = createClient(redisConfig.port, redisConfig.host);
    this.io = new Emitter(redisClient);
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message,
    @ConnectedSocket() client: Socket,
  ): void {
    const decoded = this.authorizeToken(client);

    const { id: userId, role } = decoded;
    const { chatId, content } = message;

    const payload = {
      userId: role === ActorRole.USER ? userId : chatId,
      tourGuideId: role === ActorRole.USER ? chatId : userId,
      sender: role,
      message: content,
    };
    this.chatService.saveMessage(payload);

    const roomId =
      role === ActorRole.USER
        ? `${ActorRole.USER}_${userId}_${ActorRole.TOURGUIDE}_${chatId}`
        : `${ActorRole.USER}_${chatId}_${ActorRole.TOURGUIDE}_${userId}`;

    client.to(roomId).emit('receive-messages', [{ ...payload }]);
  }

  @SubscribeMessage('get-messages')
  async getMessages(@MessageBody() message, @ConnectedSocket() client: Socket) {
    try {
      const decoded = this.authorizeToken(client);

      const { id: userId, role } = decoded;
      const { chatId } = message;

      const conversation = await this.chatService.getConversation({
        userId: role === ActorRole.USER ? userId : chatId,
        tourGuideId: role === ActorRole.USER ? chatId : userId,
      });

      client.emit('receive-messages', conversation);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('get-users')
  async getUsers(@MessageBody() message, @ConnectedSocket() client: Socket) {
    try {
      const decoded = this.authorizeToken(client);

      const { id: userId, role } = decoded;

      const result = await this.chatService.getUserChatted({
        userId,
        role,
      });

      client.emit('receive-users', result);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('join-room')
  async joinRoom(@MessageBody() message, @ConnectedSocket() client: Socket) {
    try {
      const decoded = this.authorizeToken(client);

      const { id: userId, role } = decoded;
      const { chatId } = message;

      const roomId =
        role === ActorRole.USER
          ? `${ActorRole.USER}_${userId}_${ActorRole.TOURGUIDE}_${chatId}`
          : `${ActorRole.USER}_${chatId}_${ActorRole.TOURGUIDE}_${userId}`;

      client.join(roomId);
    } catch (error) {
      console.log(error);
    }
  }

  handleConnection(client: Socket) {
    try {
      const decoded = this.authorizeToken(client);
      console.log(decoded);

      // this id decoded from token;

      const { id: userId, role } = decoded;

      client.join(`${role}_${userId}`);
    } catch (error) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  afterInit(server: Server) {
    console.log('Websocket server initialized');
  }

  authorizeToken(client: Socket): any {
    console.log('connect ', client.id);

    const { authorization } = client.handshake.headers;
    const decode = this.jwtService.decode(authorization);

    return decode;
  }
}
