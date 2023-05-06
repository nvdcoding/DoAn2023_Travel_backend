import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { authConfig } from 'src/configs/auth.config';

@Module({
  imports: [JwtModule.register({ secret: authConfig.secretJwt })],
  exports: [JwtModule],
})
export class SharedModule {}
