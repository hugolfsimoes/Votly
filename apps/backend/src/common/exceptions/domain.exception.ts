import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
  constructor(
    message: string,
    public readonly code: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, code }, status);
  }
}
