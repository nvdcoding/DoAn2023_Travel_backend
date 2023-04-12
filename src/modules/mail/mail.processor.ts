import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { emailConfig } from 'src/configs/email.config';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ForgotPasswordEmailDto } from './dto/forgot-password-email.dto';
//import * as moment from 'moment';

@Processor('mail')
export class MailProcessor {
  //   public static MAIL_BANNER_LINK = `${getConfig().get<string>('mail.domain')}banner.png`;

  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {}

  @Process('sendRegisterMail')
  async sendRegisterMail({ data }: Job<RegisterEmailDto>): Promise<number> {
    this.logger.log(
      `Start job: sendUpdateEmail user ${data.username} email ${data.email}`,
    );
    const context = {
      email: data.email,
      token: data.token,
      username: data.username,
    };
    try {
      await this.mailerService.sendMail({
        from: emailConfig.from,
        to: data.email,
        subject: `Xác nhận đăng ký KLearnIt`,
        template: `src/modules/mail/templates/register.template.hbs`,
        context: context,
      });
    } catch (e) {
      this.logger.debug(e);
    }
    this.logger.log(
      `Done job: sendUpdateEmail ${data.email} email ${data.username}`,
    );
    return 1;
  }

  @Process('sendForgotPasswordMail')
  async sendForgotPasswordMail({
    data,
  }: Job<ForgotPasswordEmailDto>): Promise<number> {
    this.logger.log(
      `Start job: sendUpdateEmail user ${data.username} email ${data.email}`,
    );
    const context = {
      email: data.email,
      token: data.token,
      username: data.username,
    };
    try {
      await this.mailerService.sendMail({
        from: emailConfig.from,
        to: data.email,
        subject: `Xác nhận quên mật khẩu KLearnIt`,
        template: `src/modules/mail/templates/forgot-password.template.hbs`,
        context: context,
      });
    } catch (e) {
      this.logger.debug(e);
    }
    this.logger.log(
      `Done job: sendUpdateEmail ${data.email} email ${data.username}`,
    );
    return 1;
  }

  // @Process('sendApproveTourMail')
  // async sendApproveTourMail() {}
}
