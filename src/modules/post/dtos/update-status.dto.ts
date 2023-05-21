import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AdminAction, PostStatus } from 'src/shares/enum/post.enum';

export class UpdateStatusBlogDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiProperty()
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;
}

export class AdminApproveRequest {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiProperty()
  @IsEnum(AdminAction)
  @IsNotEmpty()
  action: AdminAction;
}
