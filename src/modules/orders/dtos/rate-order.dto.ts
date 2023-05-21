import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RateOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  star: number;
}
