import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { MailModule } from '../mail/mail.module';
import { TourGuideModule } from '../tourguide/tour-guide.module';
import { UserModule } from '../user/user.module';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [
    UserModule,
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
    AdminModule,
  ],
  providers: [TourService],
  controllers: [TourController],
  exports: [],
})
export class TourModule {}
