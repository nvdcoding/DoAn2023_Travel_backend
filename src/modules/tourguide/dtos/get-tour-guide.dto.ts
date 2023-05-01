import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { Direction } from 'src/shares/enum/order.enum';
import { Gender, TourguideStatus } from 'src/shares/enum/tourguide.enum';

export class AdminGetTourGuideDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsEnum(TourguideStatus)
  @IsNotEmpty()
  status: TourguideStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;
}

export class GetTourGuideDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  provinces: string;

  @ApiProperty({ required: false })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({ required: false })
  @IsEnum(Direction)
  @IsOptional()
  totalTourDirection: Direction;

  @ApiProperty({ required: false })
  @IsEnum(Direction)
  @IsOptional()
  totalFavorite: Direction;
}
