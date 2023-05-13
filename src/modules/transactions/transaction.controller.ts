import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { GetTransactionDto } from 'src/shares/dtos/get-transaction.dto';
import { Response } from 'src/shares/response/response.interface';
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard';
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { WithdrawDto } from './dtos/withdraw.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
@ApiTags('Transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/user-withdraw')
  @UseGuards(UserAuthGuard)
  async userWithdraw(
    @Body() body: WithdrawDto,
    @ActorID() userId: number,
  ): Promise<Response> {
    return this.transactionService.userWithdraw(body, userId);
  }

  @Post('/tourguide-withdraw')
  @UseGuards(TourGuideAuthGuard)
  async tourGuideWithdraw(
    @Body() body: WithdrawDto,
    @ActorID() tourGuideId: number,
  ): Promise<Response> {
    return this.transactionService.tourGuideWithdraw(body, tourGuideId);
  }

  @Get('/request-withdraw')
  @UseGuards(AdminModAuthGuard)
  async getRequestList(@Query() options: GetTransactionDto): Promise<Response> {
    return this.transactionService.getListWithdrawRequest(options);
  }
}
