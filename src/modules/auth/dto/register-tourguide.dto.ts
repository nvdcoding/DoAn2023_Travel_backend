import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/shares/enum/tourguide.enum';

export class RegisterTourguideDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(10)
  phone: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  provinces: number[]; // array of province ids where tourguide operates
}
