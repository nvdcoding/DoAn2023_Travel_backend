import { User } from 'src/models/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(keyword: string, page: number, limit: number) {
    const queryBuilder = this.createQueryBuilder('user');
    queryBuilder.select([
      'user.id',
      'user.email',
      'user.username',
      'user.phone',
      'user.avatar',
      'user.verifyStatus',
      'user.voucherPoint',
    ]);
    if (keyword) {
      const keywordLike = `%${keyword}%`;
      queryBuilder
        .where('user.email LIKE :keyword')
        .orWhere('user.username LIKE :keyword')
        .orWhere('user.name LIKE :keyword')
        .orWhere('user.id LIKE :keyword')
        .orWhere('user.phone LIKE :keyword')
        .setParameters({ keyword: keywordLike });
    }
    queryBuilder.orderBy('user.id', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getManyAndCount();
  }
}
