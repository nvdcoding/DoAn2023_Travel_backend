import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { MailModule } from '../mail/mail.module';
import { TourGuideController } from './tour-guide.controller';
import { TourGuideService } from './tour-guide.service';

@Module({
  imports: [
    MailModule,
    AdminModule,
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
  providers: [TourGuideService],
  controllers: [TourGuideController],
  exports: [TourGuideService],
})
export class TourGuideModule {}
