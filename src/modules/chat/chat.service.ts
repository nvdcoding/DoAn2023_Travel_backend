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
      relations: ['user', 'tourGuide'],
    });
  }

  getUserChatted({ userId, role }) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.user', 'user', 'chat.userId = user.id')
      .leftJoinAndSelect(
        'chat.tourGuide',
        'tourGuide',
        'chat.tourGuideId = tourGuide.id',
      )
      .where(
        `${
          role === ActorRole.USER ? 'chat.userId' : 'chat.tourGuideId'
        } = :userId`,
        { userId },
      )
      .orderBy('chat.id', 'DESC')
      .groupBy('chat.userId')
      .addGroupBy('chat.tourGuideId')
      .getMany();
  }

  saveMessage(payload) {
    this.chatRepository.save(payload);
  }
}
