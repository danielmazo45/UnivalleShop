import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/port/repositories/user.repository.js';
import { User } from '../../domain/entities/user.entity.js';

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<User | null> {
    return this.userRepository.AuthenticateUser(email, password);
  }
}
