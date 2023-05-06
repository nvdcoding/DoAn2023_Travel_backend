import { ActorRole } from './../../shares/enum/auth.enum';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from 'src/models/repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  getConversation({ userId, tourGuideId }) {
    return this.chatRepository.find({
      where: [
        {
          userId,
          tourGuideId,
        },
      ],
    });
  }

  getUserChatted({ userId, role }) {
    return this.chatRepository.find({
      where: {
        ...(role === ActorRole.USER ? { userId } : { tourGuideId: userId }),
      },
    });
  }

  saveMessage(payload) {
    this.chatRepository.save(payload);
  }
}
