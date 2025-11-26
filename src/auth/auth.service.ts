import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

// Importamos los DTOs para mantener el tipado fuerte
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- REGISTRO ---
  // Cambiamos 'data: any' por 'RegisterDto' y prometemos retornar 'AuthResponseDto'
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name } = registerDto;

    // 1. Verificar si ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new BadRequestException('El email ya está registrado');

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario
    // Lógica MindFactory: Si es correo corporativo, es ADMIN
    const role = email.includes('@mindfactory.ar') ? 'ADMIN' : 'USER';

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // Asegúrate que tu schema.prisma tenga este campo o un enum
      },
    });

    // 4. Generar Token
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    // 5. Retornar estructura exacta del AuthResponseDto
    return {
      access_token: token, // <--- CAMBIO CLAVE: debe coincidir con el DTO
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // Si tu DTO incluye 'role', agrégalo aquí también
      },
    };
  }

  // --- LOGIN ---
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // 1. Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    // 3. Generar Token
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    // 4. Retornar estructura
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
