import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
