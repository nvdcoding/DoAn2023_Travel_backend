import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { BullModuleOptions } from '@nestjs/bull/dist/interfaces/bull-module-options.interface';
import { CacheModule, Logger, Module, Provider } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { MailProcessor } from './mail.processor';
import { emailConfig } from 'src/configs/email.config';
import { redisConfig } from 'src/configs/redis.config';
import { MailService } from './mail.service';

const bullOptions: BullModuleOptions = { name: 'mail' };
const providers: Provider[] = [Logger, MailProcessor, MailService];
@Module({
  imports: [
    MailerModule.forRoot({
      transport: emailConfig as TransportType,
      defaults: {
        from: emailConfig.from,
      },
      template: {
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueue(bullOptions),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
  ],
  providers: providers,
  exports: [MailService],
})
export class MailModule {}
