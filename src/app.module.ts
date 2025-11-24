import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module'; // 👈 Importamos el Módulo, no el servicio
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    PrismaModule, 
    NewsModule,
     AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 10, // Máximo 10 peticiones
    }]),], // 👈 Cargamos el módulo global aquí
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  }], // 👈 Ya no ponemos PrismaService aquí porque lo trae el módulo
})
export class AppModule {}