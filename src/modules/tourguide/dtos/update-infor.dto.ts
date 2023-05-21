import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTourguideInformationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(10)
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bio: string;
}
