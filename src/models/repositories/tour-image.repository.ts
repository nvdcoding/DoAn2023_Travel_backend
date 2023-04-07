import { EntityRepository, Repository } from 'typeorm';
import { TourImage } from '../entities/tour-image.entity';

@EntityRepository(TourImage)
export class TourImageRepository extends Repository<TourImage> {}
