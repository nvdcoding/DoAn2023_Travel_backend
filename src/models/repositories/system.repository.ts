import { EntityRepository, Repository } from 'typeorm';
import { SystemEntity } from '../entities/system.entity';

@EntityRepository(SystemEntity)
export class SystemRepository extends Repository<SystemEntity> {}
