import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { GetReportDto } from './dtos/get-report.dto';
import { ReportPostDto } from './dtos/report-post.dto';
import { ReportService } from './report.service';

@Controller('reports')
@ApiTags('Report')
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/post')
  @UseGuards(UserAuthGuard)
  async createPostReport(
    @Body() body: ReportPostDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.reportService.reportPost(body, userId);
  }

  @Get('/admin/post')
  @UseGuards(AdminModAuthGuard)
  async getReportPost(@Query() options: GetReportDto): Promise<Response> {
    return this.reportService.getReportPost(options);
  }
}
