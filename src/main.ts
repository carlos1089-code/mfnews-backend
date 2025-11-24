import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURACIÓN DE SWAGGER (Se queda en la raíz: /docs)
  const config = new DocumentBuilder()
    .setTitle('News API')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth() // Recomendado para probar rutas con token
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 

  // 2. PREFIJO GLOBAL (Mueve la API a /api, pero respeta /docs)
  app.setGlobalPrefix('api'); 
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors(); 
  await app.listen(3000);
}
bootstrap();