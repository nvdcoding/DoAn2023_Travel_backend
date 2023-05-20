import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class TransferDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  fromWeb: boolean;
}
