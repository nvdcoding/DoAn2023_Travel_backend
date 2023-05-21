import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Topics } from 'src/shares/enum/post.enum';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsEnum(Topics)
  @IsNotEmpty()
  topic: Topics;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;
}
