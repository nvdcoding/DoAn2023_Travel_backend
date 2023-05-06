import { TourGuideService } from 'src/modules/tourguide/tour-guide.service';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ChatGateWay } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [ChatGateWay, ChatService, TourGuideService],
})
export class ChatModule {}
