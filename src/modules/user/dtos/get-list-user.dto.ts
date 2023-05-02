import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';

export class AdminGetUSersDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsEnum(TourguideStatus)
  @IsNotEmpty()
  status: TourguideStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;
}
