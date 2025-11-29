import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet'; // <--- 1. IMPORTAR HELMET

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('News API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingresa tu token JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api', {
    exclude: ['docs'],
  });

  await app.listen(3000);
  console.log('🚀 API corriendo en: http://localhost:3000/api');
  console.log('📚 Swagger docs en: http://localhost:3000/docs');
}
void bootstrap();