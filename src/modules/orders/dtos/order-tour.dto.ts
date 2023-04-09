import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderTourDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tourId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberOfMember: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  // @ApiProperty({ type: [TourScheduleDto] })
  // @IsArray()
  // @ArrayMinSize(1)
  // @Type(() => TourScheduleDto)
  // @ValidateNested({ each: true })
  // tourSchedules: TourScheduleDto[];

  // @ApiProperty({ type: [TourImagesDto] })
  // @IsArray()
  // @ArrayMinSize(1)
  // @Type(() => TourImagesDto)
  // @ValidateNested({ each: true })
  // tourImages: TourImagesDto[];
}
