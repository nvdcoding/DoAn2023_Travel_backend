import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { BasePaginationRequestDto } from './base-pagination.dto';

export class GetTransactionDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
