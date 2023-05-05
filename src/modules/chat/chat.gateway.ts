import {
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

@WebSocketGateway(8001, { cors: '*' })
export class ChatGateWay {
  @WebSocketServer()
  server: Server;
  public io;

  constructor() {
    const redisClient = createClient(redisConfig.port, redisConfig.host);
    this.io = new Emitter(redisClient);
    console.log;
  }
  private logger: Logger = new Logger('MessageGateway');
  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(message);

    this.server.emit('hehe', message);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  afterInit(server: Server) {
    console.log('Websocket server initialized');
  }
}
