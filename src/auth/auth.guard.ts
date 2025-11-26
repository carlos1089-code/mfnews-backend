import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// 1. 👇 Definimos qué forma tiene lo que guardamos en el token
// (Debe coincidir con lo que pusiste en AuthService al hacer el login)
interface JwtPayload {
  id: number;
  role: string;
  iat?: number; // 'iat' y 'exp' los agrega JWT automáticamente
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'No se encontró el token de autorización',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: 'SECRET_KEY_SECRETA',
      });

      // 3. 👇 Ahora 'payload' ya no es 'any', es 'JwtPayload', así que es seguro asignarlo
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
