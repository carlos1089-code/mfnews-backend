import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiProperty({
    description: 'El titular de la noticia',
    example: 'SpaceX lanza un nuevo cohete - Actualizado',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Subtítulo o resumen breve de la noticia',
    example: 'La misión Starship 25 alcanzó la órbita terrestre',
    required: false,
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({
    description: 'El contenido completo de la noticia',
    example: 'Ayer por la tarde, la compañía aeroespacial logró...',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  body?: string;

  @ApiProperty({
    description: 'Nombre del redactor',
    example: 'Carlos Nayi',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  author?: string;

  @ApiProperty({
    description: 'URL de la imagen de portada',
    example: 'https://picsum.photos/200/300',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;
}
