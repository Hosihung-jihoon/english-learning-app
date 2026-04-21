import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix toàn bộ API với /api/v1
  app.setGlobalPrefix('api/v1');

  // Tự động validate DTO với class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,       // auto-convert types
    }),
  );

  // CORS cho Expo/React Native dev
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀  Server running on http://localhost:${port}/api/v1`);
}

bootstrap();
