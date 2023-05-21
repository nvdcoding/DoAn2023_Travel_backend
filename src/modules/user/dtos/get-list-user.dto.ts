import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';

export class AdminGetUsersDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;
}
