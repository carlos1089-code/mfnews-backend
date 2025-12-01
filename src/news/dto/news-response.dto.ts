import { ApiProperty } from '@nestjs/swagger';

export class NewsResponseDto {
  @ApiProperty({
    description: 'ID único de la noticia',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'El titular de la noticia',
    example: 'SpaceX lanza un nuevo cohete',
  })
  title: string;

  @ApiProperty({
    description: 'Subtítulo o resumen breve de la noticia',
    example: 'La misión Starship 25 alcanzó la órbita terrestre',
    required: false,
  })
  subtitle?: string;

  @ApiProperty({
    description: 'El contenido completo de la noticia',
    example: 'Ayer por la tarde, la compañía aeroespacial logró...',
  })
  body: string;

  @ApiProperty({
    description: 'Nombre del redactor',
    example: 'Carlos Nayi',
  })
  author: string;

  @ApiProperty({
    description: 'URL de la imagen de portada',
    example: 'https://picsum.photos/200/300',
    required: false,
  })
  image_url?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
