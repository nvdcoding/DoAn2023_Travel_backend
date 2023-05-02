import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';

export class UpdateStatusTourGuideDto {
  @ApiProperty()
  @IsEnum(TourguideStatus)
  @IsNotEmpty()
  status: TourguideStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  tourGuideId: number;
}
