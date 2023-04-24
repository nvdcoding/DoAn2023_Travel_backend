import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { TourGuideModule } from '../tourguide/tour-guide.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    UserModule,
    MailModule,
    TourGuideModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, MailModule],
      useFactory: (configService: ConfigService) =>
        ({
          secret: configService.get('SECRET_JWT'),
          signOptions: {
            expiresIn: '1d',
          },
        } as JwtModuleOptions),
      inject: [ConfigService],
    }),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
