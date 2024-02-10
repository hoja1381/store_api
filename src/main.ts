import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformBigint } from './common/interceptor/transform_bigint.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieSession({ keys: [process.env.COOKIE_SESSION_KEY] }));

  app.useGlobalInterceptors(new TransformBigint());

  app.useStaticAssets(join(__dirname, '..', 'images'), { prefix: '/images/' });

  const config = new DocumentBuilder()
    .setTitle('store_api')
    .setDescription('online store')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(3000);
}
bootstrap();
