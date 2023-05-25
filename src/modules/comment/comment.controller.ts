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
import { IsLoginGuard } from '../auth/guards/is-login.guard';
import { CommentService } from './comment.service';
import {
  CommentDto,
  GetCommentDto,
  UpdateCommentDto,
} from './dtos/comment.dto';

@Controller('comments')
@ApiTags('Comment')
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  @UseGuards(IsLoginGuard)
  async createComment(
    @Body() body: CommentDto,
    @ActorID() userId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.commentService.createComment(body, userId, actorRole);
  }

  @Put('/')
  @UseGuards(IsLoginGuard)
  async updateComment(
    @Body() body: UpdateCommentDto,
    @ActorID() userId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.commentService.updateComment(body, userId, actorRole);
  }

  @Delete('/:id')
  @UseGuards(IsLoginGuard)
  async deleteComment(
    @Param('id') id: number,
    @ActorID() actorId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.commentService.deleteComment(id, actorId, actorRole);
  }

  @Get('/')
  async getComment(@Query() options: GetCommentDto): Promise<Response> {
    return this.commentService.getPostComment(options);
  }
}
