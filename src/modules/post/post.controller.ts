import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorRoleDecorator } from 'src/shares/decorators/get-role.decorator';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { IsLoginGuard } from '../auth/guards/is-login.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { CreateBlogDto } from './dtos/create-post.dto';
import { AdminGetPostDto } from './dtos/get-post.dto';
import { UpdateBlogDto } from './dtos/update-post.dto';
import { UpdateStatusBlogDto } from './dtos/update-status.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('Post')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/user-tourguide')
  @UseGuards(IsLoginGuard)
  async createPost(
    @Body() body: CreateBlogDto,
    @ActorID() actorId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.postService.createPost(body, actorId, actorRole);
  }

  @Put('/user-tourguide')
  @UseGuards(IsLoginGuard)
  async updatePostContent(
    @Body() body: UpdateBlogDto,
    @ActorID() actorId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.postService.updatePost(body, actorId, actorRole);
  }

  @Get('/admin')
  @UseGuards(AdminModAuthGuard)
  async adminGetPost(@Query() options: AdminGetPostDto): Promise<Response> {
    return this.postService.getPostByStatus(options);
  }

  // @Put('/admin/approve-update')
  // @UseGuards(AdminModAuthGuard)
  // async adminApproveUpdatePost(
  //   @Body() body: AdminApproveRequest,
  // ): Promise<Response> {
  //   return this.postService.adminApproveUpdateRequest(body);
  // }

  @Put('/admin')
  @UseGuards(AdminModAuthGuard)
  async approvePost(@Body() body: UpdateStatusBlogDto): Promise<Response> {
    return this.postService.adminUpdateStatusPost(body);
  }
}
