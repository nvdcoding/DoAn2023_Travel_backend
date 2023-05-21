import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
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
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
