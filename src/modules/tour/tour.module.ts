import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [
    UserModule,
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
    })
  ],
  providers: [TourService],
  controllers: [TourController],
  exports: [],
})
export class TourModule {}
