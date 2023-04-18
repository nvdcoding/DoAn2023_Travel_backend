import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { DiscountType } from 'src/shares/enum/voucher.enum';

export class CreateVoucherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType: DiscountType;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  requirementPoint: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: number;
}
