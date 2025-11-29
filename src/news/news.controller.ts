import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards, // 👈 1. Importado para activar la seguridad
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('News')

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva noticia' })
  @ApiResponse({
    status: 201,
    description: 'Noticia creada exitosamente.',
    type: NewsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado (Falta token).' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las noticias' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Búsqueda por título o contenido',
    example: 'SpaceX',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de noticias',
    type: [NewsResponseDto],
  })
  findAll(@Query('search') search?: string) {
    return this.newsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una noticia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la noticia',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la noticia',
    type: NewsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar una noticia existente' })
  @ApiParam({
    name: 'id',
    description: 'ID de la noticia',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Noticia actualizada exitosamente.',
    type: NewsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una noticia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la noticia',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Noticia eliminada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Noticia no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}
