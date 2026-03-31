import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Module({
  providers: [UsersRepository, CreateUserUseCase],
  exports: [UsersRepository, CreateUserUseCase],
})
export class UsersModule {}
