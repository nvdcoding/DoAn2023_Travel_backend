import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'typeorm';
import { HttpExceptionFilter } from './shares/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { RedisIoAdapter } from './adapters/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useWebSocketAdapter(new RedisIoAdapter(app));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('ktravel')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('ktravel', app, document);
  await app.listen(3000);
}
bootstrap();
