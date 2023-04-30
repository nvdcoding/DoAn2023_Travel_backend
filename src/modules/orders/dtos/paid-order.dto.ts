import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaidOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
