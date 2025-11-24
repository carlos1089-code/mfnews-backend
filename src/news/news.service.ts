import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service'; // 👈 1. Importamos el servicio de IA

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService // 👈 2. Inyectamos el servicio
  ) {}

  // --- CREAR (Con Vector) ---
  async create(createNewsDto: CreateNewsDto) {
    // A. Convertimos el texto a números (Embedding)
    const textToEmbed = `${createNewsDto.title} ${createNewsDto.body}`;
    const embedding = await this.aiService.generateEmbedding(textToEmbed);
    
    // Formato para Postgres: "[0.1, 0.2, ...]"
    const vectorString = `[${embedding.join(',')}]`;

    // B. Guardamos con SQL Puro (Prisma create no soporta escribir vectores directo aún)
    await this.prisma.$executeRaw`
      INSERT INTO "News" (title, body, image_url, author, date, embedding)
      VALUES (
        ${createNewsDto.title}, 
        ${createNewsDto.body}, 
        ${createNewsDto.image_url}, 
        ${createNewsDto.author}, 
        NOW(), 
        ${vectorString}::vector
      );
    `;

    return { message: 'Noticia creada e indexada con IA' };
  }

  // --- BUSCAR (Inteligente) ---
  async findAll(search?: string) {
    // A. Si NO hay búsqueda, comportamiento normal (rápido)
    if (!search) {
      return this.prisma.news.findMany({
        orderBy: { date: 'desc' },
        // Opcional: seleccionamos campos específicos para no traer el vector gigante
        select: { id: true, title: true, body: true, image_url: true, author: true, date: true } 
      });
    }

    // B. Si HAY búsqueda, usamos la IA
    const queryVector = await this.aiService.generateEmbedding(search);
    const vectorString = `[${queryVector.join(',')}]`;

    // Buscamos las noticias más cercanas semánticamente (operador <=>)
    const results = await this.prisma.$queryRaw`
      SELECT id, title, body, image_url, author, date
      FROM "News"
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 10;
    `;

    return results;
  }

  // --- BUSCAR UNA (Por ID) ---
  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException(`La noticia con ID ${id} no existe`);
    }

    return news;
  }


 async update(id: number, updateNewsDto: UpdateNewsDto) { 
   const current = await this.findOne(id); 
  
   if (updateNewsDto.title || updateNewsDto.body) {
          
     const newTitle = updateNewsDto.title || current.title;
     const newBody = updateNewsDto.body || current.body;

       // ... El resto sigue igual ...
      const embedding = await this.aiService.generateEmbedding(`${newTitle} ${newBody}`);
      const vectorString = `[${embedding.join(',')}]`;
      
      await this.prisma.$executeRaw`
         UPDATE "News"
         SET title = ${newTitle}, 
         body = ${newBody}, 
         image_url = ${updateNewsDto.image_url || current.image_url},
         author = ${updateNewsDto.author || current.author},
         embedding = ${vectorString}::vector
        WHERE id = ${id}`;
        
        return { message: 'Noticia actualizada (IA re-indexada)' };
       }

// 3. Si no hay cambios de texto, actualización normal
      return await this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
      });
 }
  // --- ELIMINAR ---
  async remove(id: number) {
    // Verificamos existencia
    await this.findOne(id);
    
    return await this.prisma.news.delete({
      where: { id },
    });
  }
}