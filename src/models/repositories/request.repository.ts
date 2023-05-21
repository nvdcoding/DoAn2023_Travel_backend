import { EntityRepository, Repository } from 'typeorm';
import { UserRequest } from '../entities/user-request.entity';

@EntityRepository(UserRequest)
export class UserRequestRepository extends Repository<UserRequest> {}
