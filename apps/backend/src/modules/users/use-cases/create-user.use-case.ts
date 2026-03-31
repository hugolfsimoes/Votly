import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersRepository } from '../repositories/users.repository';

export type CreateUserInput = {
  email: string;
  password: string;
  name?: string;
};

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existing = await this.usersRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    return this.usersRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });
  }
}
