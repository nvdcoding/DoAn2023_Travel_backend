import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { AdminGetPostDto } from './dtos/get-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('Post')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get('/admin')
  @UseGuards(AdminModAuthGuard)
  async adminGetPost(@Query() options: AdminGetPostDto): Promise<Response> {
    return this.postService.getPostByStatus(options);
  }

  @Put('/admin')
  @UseGuards(AdminModAuthGuard)
  async approvePost(@Query() options: AdminGetPostDto): Promise<Response> {
    return this.postService.getPostByStatus(options);
  }
}
