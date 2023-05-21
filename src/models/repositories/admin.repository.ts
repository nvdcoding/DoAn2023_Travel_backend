import { EntityRepository, Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
  async getAdmins(keyword: string, page: number, limit: number) {
    const queryBuilder = this.createQueryBuilder('admin');
    queryBuilder.select([
      'admin.id',
      'admin.email',
      'admin.username',
      'admin.role',
      'admin.status',
    ]);
    if (keyword) {
      const keywordLike = `%${keyword}%`;
      queryBuilder
        .where('admin.email LIKE :keyword')
        .orWhere('admin.username LIKE :keyword')
        .orWhere('admin.id LIKE :keyword')
        .setParameters({ keyword: keywordLike });
    }
    queryBuilder.orderBy('admin.id', 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getManyAndCount();
  }
}
