import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TourScheduleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
