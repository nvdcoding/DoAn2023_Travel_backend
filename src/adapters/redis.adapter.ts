import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisConfig } from 'src/configs/redis.config';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number): any {
    const server = super.createIOServer(port);
    const pubClient = createClient({
      url: `redis://${redisConfig}:${redisConfig.port}`,
    });
    const subClient = pubClient.duplicate();

    server.adapter(createAdapter(pubClient, subClient));
    return server;
  }
}
