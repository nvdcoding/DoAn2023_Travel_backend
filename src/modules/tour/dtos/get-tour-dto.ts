import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';

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
