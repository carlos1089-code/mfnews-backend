import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  // --- CREAR (Normal) ---
  async create(createNewsDto: CreateNewsDto) {
    return await this.prisma.news.create({
      data: createNewsDto,
    });
  }

  // --- BUSCAR (Filtro de Texto Simple) ---
  async findAll(search?: string) {
    // 👇 ESPÍA 1: ¿Llega el texto?
    console.log("🔎 BUSCANDO EN SERVICIO:", search);

    const whereConfig = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { author: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // 👇 ESPÍA 2: ¿Cómo queda el filtro?
    console.log("⚙️ FILTRO PRISMA:", JSON.stringify(whereConfig));

    return await this.prisma.news.findMany({
      where: whereConfig,
      orderBy: { date: 'desc' },
    });
  }

  // --- BUSCAR UNO ---
  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException(`La noticia con ID ${id} no existe`);
    }

    return news;
  }

  // --- ACTUALIZAR ---
  async update(id: number, updateNewsDto: UpdateNewsDto) {
    // Verificamos existencia
    await this.findOne(id);

    return await this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  // --- ELIMINAR ---
  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.news.delete({
      where: { id },
    });
  }
}