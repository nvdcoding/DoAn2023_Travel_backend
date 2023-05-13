import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorRoleDecorator } from 'src/shares/decorators/get-role.decorator';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { Response } from 'src/shares/response/response.interface';
import { IsLoginGuard } from '../auth/guards/is-login.guard';
import { CommentService } from './comment.service';
import { CommentDto } from './dtos/comment.dto';

@Controller('comments')
@ApiTags('Comment')
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // @Post('/')
  // @UseGuards(IsLoginGuard)
  // async createComment(
  //   @Body() body: CommentDto,
  //   @ActorRoleDecorator() role: ActorRole,
  //   @ActorID()
  // ): Promise<Response> {
  //   return this.commentService.cre(query);
  // }
}
