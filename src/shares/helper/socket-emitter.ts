import { Logger } from '@nestjs/common';
import { Emitter } from '@socket.io/redis-emitter';
import { createClient } from 'redis';
import { redisConfig } from 'src/configs/redis.config';
import { ActorRole } from '../enum/auth.enum';

export class SocketEmitter {
  private static instance: SocketEmitter;
  public io;

  private constructor() {
    const redisClient = createClient(redisConfig.port, redisConfig.host);
    this.io = new Emitter(redisClient);
  }

  public static getInstance(): SocketEmitter {
    if (!SocketEmitter.instance) {
      SocketEmitter.instance = new SocketEmitter();
    }
    return SocketEmitter.instance;
  }

  public emitSuggest(
    userId: number,
    message: string,
    tourGuideId: number,
  ): void {
    const payload = {
      userId: userId,
      tourGuideId: tourGuideId,
      sender: 'TOURGUIDE',
      message,
    };
    this.io
      .to(`${ActorRole.USER}_${userId}_${ActorRole.TOURGUIDE}_${tourGuideId}`)
      .emit('receive-messages', [{ ...payload }]);
  }
}
