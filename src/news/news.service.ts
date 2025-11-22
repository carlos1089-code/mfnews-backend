import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class NewsService {
  // Inyectamos Prisma en el constructor
  constructor(private prisma: PrismaService) {}

  // Crear Noticia
  async create(createNewsDto: CreateNewsDto) {
    return await this.prisma.news.create({
      data: createNewsDto, // Prisma acepta el DTO directo porque coinciden los nombres
    });
  }

  // Obtener todas
  async findAll() {
    return await this.prisma.news.findMany({
      orderBy: { date: 'desc' } // Ordenamos por fecha (plus visual)
    });
  }

  // Obtener una por ID
  async findOne(id: number) {
    return await this.prisma.news.findUnique({
      where: { id },
    });
  }

  // Actualizar
  async update(id: number, updateNewsDto: UpdateNewsDto) {
    return await this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  // Eliminar
  async remove(id: number) {
    return await this.prisma.news.delete({
      where: { id },
    });
  }
}