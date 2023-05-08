import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class TransferDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
