import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserUseCase } from '../users/use-cases/create-user.use-case';
import { SigninUseCase } from './use-cases/signin.use-case';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly signinUseCase: SigninUseCase,
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const user = await this.createUser.execute(dto);
    return this.buildTokenResponse(user.id, user.email);
  }

  async signin(email: string, password: string) {
    const user = await this.signinUseCase.execute(email, password);
    return this.buildTokenResponse(user.id, user.email);
  }

  private buildTokenResponse(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwt.sign(payload);
    return { accessToken, user: { id: userId, email } };
  }
}
