import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module'; // 👈 Importamos el Módulo, no el servicio

@Module({
  imports: [PrismaModule, NewsModule], // 👈 Cargamos el módulo global aquí
  controllers: [],
  providers: [], // 👈 Ya no ponemos PrismaService aquí porque lo trae el módulo
})
export class AppModule {}