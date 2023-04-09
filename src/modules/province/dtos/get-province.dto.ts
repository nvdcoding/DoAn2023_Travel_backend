import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class getProvinceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;
}
