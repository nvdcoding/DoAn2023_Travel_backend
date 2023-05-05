import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';

@Controller('chats')
@ApiTags('Chat')
@ApiBearerAuth()
export class ChatController {
  constructor() {}

  // @Get('/')
  // async getProvinces(@Query() query: getProvinceDto): Promise<Response> {
  //   return this.provinceService.getProvinces(query);
  // }

  // @Post('/start-chat')
}
