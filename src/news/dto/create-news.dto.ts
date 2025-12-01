import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'El titular de la noticia',
    example: 'SpaceX lanza un nuevo cohete',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

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
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Nombre del redactor',
    example: 'Carlos Nayi',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'URL de la imagen de portada',
    example: 'https://picsum.photos/200/300',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;
}
