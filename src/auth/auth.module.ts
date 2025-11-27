import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    // Configuración Global del JWT
    JwtModule.register({
      global: true,
      // IMPORTANTE: Busca la variable de entorno, si no existe usa la frase fija
      secret: process.env.JWT_SECRET || 'secreto_super_seguro',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], // Exportamos JwtModule para que otros módulos lo usen
})
export class AuthModule {}
