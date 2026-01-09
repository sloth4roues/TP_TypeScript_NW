import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const config = app.get(ConfigService);
  const dataSource = app.get(DataSource);

  const ttl = Number(config.get('SESSION_TTL_SECONDS') ?? 86400);

  app.use(
    session({
      name: config.get('SESSION_NAME') ?? 'sid',
      secret: config.get('SESSION_SECRET') ?? 'change_me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // HTTPS only
        maxAge: ttl * 1000,
      },
      store: new TypeormStore({
        ttl,
        cleanupLimit: 2,
      }).connect(dataSource.getRepository('sessions')),
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.get('PORT') ?? 3000);
}
bootstrap();
