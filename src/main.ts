import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitar CORS (Para que el Frontend React pueda pedir datos)
  app.enableCors();

  // 2. Prefijo Global (Para que todas las rutas sean /api/news, /api/auth...)
  app.setGlobalPrefix('api');

  // 3. Activar Validaciones Globales (Para que funcionen los DTOs)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos extra que no estén en el DTO
    forbidNonWhitelisted: true, // Tira error si mandan datos basura
  }));

  await app.listen(3000);
}
bootstrap();