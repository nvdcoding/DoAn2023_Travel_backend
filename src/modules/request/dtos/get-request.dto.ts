import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';

export class GetUserRequestDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  provinceId: number;
}
