import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ActionApproveOrder } from 'src/shares/enum/order.enum';

export class ApproveOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsEnum(ActionApproveOrder)
  @IsNotEmpty()
  action: ActionApproveOrder;
}
