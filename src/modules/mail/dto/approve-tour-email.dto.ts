import { Tour } from 'src/models/entities/tour.entity';

export class ApproveTourEmailDto {
  email: string;
  username: string;
  tour: Tour;
}
