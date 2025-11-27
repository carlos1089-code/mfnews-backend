import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [NewsController], //Esto es quien recibe la peticion (//!Esto lo creas y lo exportas en controllers)
  providers: [NewsService], //Esto es quien tiene la logica de negocio
})
export class NewsModule {}
