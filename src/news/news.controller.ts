// 1. AGREGAR 'Query' a los imports
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto'; 
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('News')
@Controller('news')
export class NewsController {
  
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva noticia' })
  @ApiResponse({ status: 201, description: 'Noticia creada exitosamente.' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  // --- LISTAR TODAS (CON BÚSQUEDA) ---
  @Get()
  @ApiOperation({ summary: 'Obtener todas las noticias' })
  // 2. AGREGAR ESTO: @Query('search')
  findAll(@Query('search') search?: string) {
    // Ahora sí le pasamos el texto al servicio
    return this.newsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una noticia' })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar una noticia existente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una noticia' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}