import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  provinceId: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;
}
