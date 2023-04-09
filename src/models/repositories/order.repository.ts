import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../entities/orders.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {}
