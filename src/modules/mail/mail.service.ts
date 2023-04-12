import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ForgotPasswordEmailDto } from './dto/forgot-password-email.dto';
import { ApproveTourEmailDto } from './dto/approve-tour-email.dto';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly emailQueue: Queue) {}

  async sendRegisterMail(registerDto: RegisterEmailDto): Promise<void> {
    await this.emailQueue.add('sendRegisterMail', {
      ...registerDto,
    });
  }

  async sendForgotPasswordMail(
    forgotPasswordDto: ForgotPasswordEmailDto,
  ): Promise<void> {
    await this.emailQueue.add('sendForgotPasswordMail', {
      ...forgotPasswordDto,
    });
  }

  async sendApproveTourMail(
    approveTourEmailDto: ApproveTourEmailDto,
  ): Promise<void> {
    await this.emailQueue.add('sendApproveTourMail', {
      ...approveTourEmailDto,
    });
  }
}
