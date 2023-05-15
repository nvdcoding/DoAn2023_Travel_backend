import { Tour } from 'src/models/entities/tour.entity';

export class CreateMeetingDto {
  email: string;
  username: string;
  name: string;
  content: string;
  date: string;
  tourName: string;
}
