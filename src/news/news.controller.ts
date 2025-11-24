import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
// Asegúrate de tener este DTO creado, si no, usa Partial<CreateNewsDto> por ahora
import { UpdateNewsDto } from './dto/update-news.dto'; 
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('News')
@Controller('news')
export class NewsController {
  
  constructor(private readonly newsService: NewsService) {}

  // --- CREAR ---
  @Post()
  @ApiOperation({ summary: 'Crear una nueva noticia' })
  @ApiResponse({ status: 201, description: 'Noticia creada exitosamente.' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  // --- LISTAR TODAS ---
  @Get()
  @ApiOperation({ summary: 'Obtener todas las noticias' })
  findAll() {
    return this.newsService.findAll();
  }

  // --- OBTENER UNA (ESTE ES EL QUE TE FALTABA) ---
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una noticia' })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    // ParseIntPipe convierte el "11" (string) a 11 (number) automáticamente
    return this.newsService.findOne(id);
  }

  // --- EDITAR ---
  @Patch(':id')
  @ApiOperation({ summary: 'Editar una noticia existente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  // --- ELIMINAR ---
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una noticia' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}