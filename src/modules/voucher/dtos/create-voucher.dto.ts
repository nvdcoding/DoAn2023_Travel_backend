import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
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
  @IsInt()
  @Min(0)
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
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
