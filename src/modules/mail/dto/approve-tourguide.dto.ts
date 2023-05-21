import { ActionApproveOrder } from 'src/shares/enum/order.enum';
import { ActionResponseRegisterTourguide } from 'src/shares/enum/tourguide.enum';

export class ApproveTourGuideDto {
  email: string;
  tourGuideName: string;
  action: ActionResponseRegisterTourguide;
}
