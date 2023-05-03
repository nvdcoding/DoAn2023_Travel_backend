import { PostStatus } from 'src/shares/enum/post.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async getPostByStatusAndKeyword(
    keyword: string,
    status: PostStatus,
    page: number,
    limit: number,
  ) {
    const queryBuilder = this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.tourGuide', 'tourGuide');
    if (keyword) {
      const keywordLike = `%${keyword}%`;
      queryBuilder
        .where('post.title LIKE :keyword')
        .orWhere('post.name LIKE :keyword')
        .orWhere('post.id LIKE :keyword')
        .orWhere('user.username LIKE :keyword')
        .orWhere('tourGuide.username LIKE :keyword')
        .orWhere('tourGuide.name LIKE :keyword')
        .setParameters({ keyword: keywordLike });
    }
    queryBuilder
      .andWhere('post.status = :status', { status })
      .orderBy('post.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    return queryBuilder.getManyAndCount();
  }
}
