import { ActionApproveOrder } from 'src/shares/enum/order.enum';

export class ApproveOrderEmailDto {
  email: string;
  tourGuideName: string;
  username: string;
  action: ActionApproveOrder;
}
