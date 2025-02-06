import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  await app.listen(process.env.PORT);
  Logger.log(`Application Running on Port: ${ process.env.PORT }`);
}
bootstrap();
