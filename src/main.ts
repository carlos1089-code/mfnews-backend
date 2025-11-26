import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Configura Swagger ANTES del prefijo global
  const config = new DocumentBuilder()
    .setTitle('News API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ✅ Aplica el prefijo DESPUÉS de configurar Swagger
  // Y excluye explícitamente la ruta de docs
  app.setGlobalPrefix('api', {
    exclude: ['docs'],
  });

  await app.listen(3000);
  console.log('🚀 API corriendo en: http://localhost:3000/api');
  console.log('📚 Swagger docs en: http://localhost:3000/docs');
}
void bootstrap();
