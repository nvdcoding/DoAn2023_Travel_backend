import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isHistory: boolean;
}

export class GetTransactionWithdrawDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isHistory: string;
}
