import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsUrl() // Valida que sea una URL real
  @IsOptional() // Puede ser nulo
  image_url?: string;
}
