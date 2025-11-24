// 1. IMPORTANTE: Agregar NotFoundException
import { Injectable, NotFoundException } from '@nestjs/common'; 
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto) {
    return await this.prisma.news.create({
      data: createNewsDto,
    });
  }

  async findAll() {
    return await this.prisma.news.findMany({
      orderBy: { date: 'desc' }
    });
  }

  // 👇 AQUÍ ESTÁ EL CAMBIO CLAVE
  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    // Si es null (no existe), lanzamos el error 404 explícitamente
    if (!news) {
      throw new NotFoundException(`La noticia con ID ${id} no existe`);
    }

    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    // Opcional: Podrías verificar si existe antes de actualizar también
    // pero para este test, el cambio en findOne es lo que importa.
    return await this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.news.delete({
      where: { id },
    });
  }
}