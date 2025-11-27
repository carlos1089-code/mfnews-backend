import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de acceso (Estándar NestJS)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Alias del token para compatibilidad con el Frontend',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'Información del usuario',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', example: 'juan.perez@example.com' },
      role: { type: 'string', example: 'ADMIN' },
    },
  })
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
