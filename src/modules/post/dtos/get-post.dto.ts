import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { PostStatus } from 'src/shares/enum/post.enum';

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
