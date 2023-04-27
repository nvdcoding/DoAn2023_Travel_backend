import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { TourTypes } from 'src/shares/enum/tour.enum';
import { TourTypesDto } from './tour-type.dto';

export class GetTourDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  provinceId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tourGuideId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  minPrice: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  maxPrice: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  types: string;
}
