import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/** Aceita cuid / ulid / uuid — o que o Prisma usar em `@id`. */
@Injectable()
export class ParsePrismaIdPipe implements PipeTransform<string, string> {
  constructor(private readonly fieldName = 'id') {}

  transform(value: string, _metadata?: ArgumentMetadata): string {
    if (value === undefined || value === null) {
      throw new BadRequestException(`${this.fieldName} é obrigatório`);
    }
    const s = String(value).trim();
    if (s.length === 0) {
      throw new BadRequestException(`${this.fieldName} é obrigatório`);
    }
    if (s.length > 128) {
      throw new BadRequestException(`${this.fieldName} inválido`);
    }
    return s;
  }
}
