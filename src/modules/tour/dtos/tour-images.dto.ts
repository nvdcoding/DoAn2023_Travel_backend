import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class TourImagesDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
