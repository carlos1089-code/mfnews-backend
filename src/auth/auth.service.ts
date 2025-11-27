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
    const role = email.includes('@mindfactory.ar') ? 'ADMIN' : 'USER';

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
      },
    });

    // 4. Generar Token
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    // 5. Retornar (CORREGIDO PARA TU FRONTEND)
    return {
      token: token,
      access_token: token, // Enviamos los dos por si acaso quieres arreglar el DTO luego
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // --- LOGIN ---
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    return {
      //ts-eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      token: token,
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
