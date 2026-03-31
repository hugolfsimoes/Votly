import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersRepository } from '../../users/repositories/users.repository';

@Injectable()
export class SigninUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }
}
