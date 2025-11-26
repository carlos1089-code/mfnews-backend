import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- REGISTRO ---
  async register(data: { name: string; email: string; password: string }) {
    // 1. Verificar si ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser)
      throw new BadRequestException('El email ya está registrado');

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Crear usuario (Por defecto USER)
    // Si el email contiene "@mindfactory.ar", lo hacemos ADMIN (truco rápido)
    const role = data.email.includes('@mindfactory.ar') ? 'ADMIN' : 'USER';

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: role,
      },
    });

    // 4. Generar Token
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    return {
      message: 'Usuario creado',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  // --- LOGIN ---
  async login(data: { email: string; password: string }) {
    // 1. Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    // 3. Generar Token
    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
