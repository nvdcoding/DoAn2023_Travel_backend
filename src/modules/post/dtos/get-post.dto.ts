import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { PostStatus, Topics } from 'src/shares/enum/post.enum';

export class AdminGetPostDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;
}

export class GetPostDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsEnum(Topics)
  @IsNotEmpty()
  topics: Topics;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string;
}
