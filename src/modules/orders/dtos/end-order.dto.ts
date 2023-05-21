import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class EndOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
