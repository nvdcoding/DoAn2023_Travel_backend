import { Module } from '@nestjs/common';
import { ChatGateWay } from './chat.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateWay],
})
export class ChatModule {}
