import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateBlogDto } from './dtos/create-post.dto';
import { AdminGetPostDto, GetPostDto } from './dtos/get-post.dto';
import { UpdateBlogDto } from './dtos/update-post.dto';
import {
  AdminApproveRequest,
  UpdateStatusBlogDto,
} from './dtos/update-status.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('Post')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/user-tourguide/:id')
  async getOnePost(@Param('id') id: number): Promise<Response> {
    return this.postService.getOnePost(id, 'user');
  }

  @Get('/user-tourguide')
  async getListPost(@Query() options: GetPostDto): Promise<Response> {
    return this.postService.getListPost(options);
  }

  @Post('/user-tourguide')
  @UseGuards(IsLoginGuard)
  async createPost(
    @Body() body: CreateBlogDto,
    @ActorID() actorId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.postService.createPost(body, actorId, actorRole);
  }

  @Delete('/user-tourguide/:id')
  @UseGuards(IsLoginGuard)
  async userDeletePost(
    @Param('id') id: number,
    @ActorID() actorId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.postService.deletePost(id, actorId, actorRole);
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

  @Get('/admin/:id')
  @UseGuards(AdminModAuthGuard)
  async adminGetOnePost(@Param('id') id: number): Promise<Response> {
    return this.postService.getOnePost(id, 'admin');
  }
  @Delete('/admin/:id')
  @UseGuards(IsLoginGuard)
  async adminDeletePost(
    @Param('id') id: number,
    @ActorID() actorId: number,
  ): Promise<Response> {
    return this.postService.deletePost(id, actorId, ActorRole.ADMIN);
  }

  @Put('/admin/approve-update')
  @UseGuards(AdminModAuthGuard)
  async adminApproveUpdatePost(
    @Body() body: AdminApproveRequest,
  ): Promise<Response> {
    return this.postService.approveUpdateRequest(body);
  }

  @Put('/admin')
  @UseGuards(AdminModAuthGuard)
  async approvePost(@Body() body: UpdateStatusBlogDto): Promise<Response> {
    return this.postService.adminUpdateStatusPost(body);
  }
}
