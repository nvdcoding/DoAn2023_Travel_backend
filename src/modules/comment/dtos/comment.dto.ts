import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';

export class CommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parrentCommentId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  postId: number;
}

export class GetCommentDto extends BasePaginationRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  postId: string;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  commentId: number;
}
