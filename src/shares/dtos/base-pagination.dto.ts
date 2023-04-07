import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @Min(1)
  @Max(100)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10;

  @ApiProperty({ required: false })
  @Min(1)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page = 1;
}

export class BasePaginationResponseDto<T = any> {
  @ApiProperty() total: number;
  data: T[];

  static convertToPaginationResponse<T = any>(
    data: [any[], number],
    currentPage?: number,
  ) {
    return {
      data: data[0],
      total: data[1],
      currentPage,
    } as BasePaginationResponseDto<T>;
  }

  static convertToPaginationWithTotalPages<T = any>(
    data: [any[], number],
    currentPage?: number,
    limit?: number,
  ) {
    currentPage = currentPage || 1;
    limit = limit || 10;

    return {
      data: data[0],
      total: data[1],
      currentPage,
      totalPages: Math.ceil(data[1] / limit),
      limit,
    } as BasePaginationResponseDto<T>;
  }
}
