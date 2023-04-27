import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TourScheduleDto } from './tour-schedule.dto';
import { Type } from 'class-transformer';
import { TourImage } from 'src/models/entities/tour-image.entity';
import { TourImagesDto } from './tour-images.dto';
import { TourTypes } from 'src/shares/enum/tour.enum';

export class CreateTourDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxMember: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  feePerMember: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  provinceId: number;

  @ApiProperty()
  @IsEnum(TourTypes)
  @IsNotEmpty()
  type: TourTypes;

  @ApiProperty({ type: [TourScheduleDto] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => TourScheduleDto)
  @ValidateNested({ each: true })
  tourSchedules: TourScheduleDto[];

  @ApiProperty({ type: [TourImagesDto] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => TourImagesDto)
  @ValidateNested({ each: true })
  tourImages: TourImagesDto[];
}
