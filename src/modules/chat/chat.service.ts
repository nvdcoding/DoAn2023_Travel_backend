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
      .leftJoinAndSelect('chat.user', 'user', 'chat.user_id = user.id')
      .leftJoinAndSelect(
        'chat.tourGuide',
        'tourGuide',
        'chat.tour_guide_id = tourGuide.id',
      )
      .where(
        `${
          role === ActorRole.USER ? 'chat.userId' : 'chat.tourGuideId'
        } = :userId`,
        { userId },
      )
      .orderBy('id', 'DESC')
      .groupBy('chat.userId')
      .addGroupBy('chat.tourGuideId')
      .getMany();
  }

  saveMessage(payload) {
    this.chatRepository.save(payload);
  }
}
