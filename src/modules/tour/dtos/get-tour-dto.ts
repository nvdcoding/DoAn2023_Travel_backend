import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';

export class GetTourDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  provinceId: number;

  @ApiProperty({ required: false })
  @IsNumber()
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
}
