import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case.js';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case.js';

interface PublicUser {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date;
}

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: unknown): Promise<PublicUser> {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new BadRequestException('Debes enviar un objeto JSON');
    }
    const payload = body as Record<string, unknown>;
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';
    if (!email || !password) {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }
    const user = await this.loginUserUseCase.execute(email, password);
    if (!user) throw new UnauthorizedException('Correo o contraseña incorrectos');
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  }

  @Post()
  async create(@Body() body: unknown): Promise<PublicUser> {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new BadRequestException('Debes enviar un objeto JSON');
    }
    const payload = body as Record<string, unknown>;
    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';

    if (name.length < 2) {
      throw new BadRequestException('El nombre debe tener al menos 2 caracteres');
    }
    if (!/^[^\s@]+@(correounivalle\.edu\.co|univalle\.edu\.co)$/.test(email)) {
      throw new BadRequestException('Usa un correo institucional de Univalle');
    }
    if (password.length < 8) {
      throw new BadRequestException('La contraseña debe tener mínimo 8 caracteres');
    }

    try {
      const user = await this.createUserUseCase.execute({ name, email, password });
      return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    } catch (error: unknown) {
      if (
        typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
      ) {
        throw new ConflictException('Este correo ya está registrado');
      }
      throw error;
    }
  }
}
