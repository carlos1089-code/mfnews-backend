import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de acceso (Estándar NestJS)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  // --- NUEVO: Esto soluciona el error rojo de TypeScript ---
  @ApiProperty({
    description: 'Alias del token para compatibilidad con el Frontend',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
  // ---------------------------------------------------------

  @ApiProperty({
    description: 'Información del usuario',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', example: 'juan.perez@example.com' },
      role: { type: 'string', example: 'ADMIN' }, // Aseguramos que Swagger muestre el rol
    },
  })
  user: {
    id: number;
    name: string;
    email: string;
    role: string; // Esto permite que TypeScript acepte el rol en el servicio
  };
}
