import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AproveActionWithdraw } from 'src/shares/enum/transaction.enum';

export class AdminAproveWithdrawRequest {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  withdrawId: number;

  @ApiProperty()
  @IsEnum(AproveActionWithdraw)
  @IsNotEmpty()
  action: AproveActionWithdraw;
}
