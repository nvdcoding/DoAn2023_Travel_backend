import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
// import { AdminAction } from 'src/shares/enum/post.enum';

export class UpdateBlogDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

// export class AdminApproveRequest {
//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   postId: number;

//   @ApiProperty()
//   @IsEnum(AdminAction)
//   @IsNotEmpty()
//   action: AdminAction;
// }
