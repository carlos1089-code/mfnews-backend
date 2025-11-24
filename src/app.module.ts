import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Módulos
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module'; // 👈 Importamos el Módulo Nuevo

@Module({
  imports: [
    PrismaModule, 
    NewsModule,
    AuthModule,
    AiModule, // 👈 Cargamos el módulo de IA (que ya es Global)
    
    // Configuración del Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10, 
    }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    
  ],
})
export class AppModule {}