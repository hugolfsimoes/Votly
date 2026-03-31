import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Vote } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { VotesRepository } from '../repositories/votes.repository';

/**
 * Transação + `upsert` em `@@unique([userId, itemId])`:
 * uma única linha por par usuário/item — evita duplicata e corrida no PostgreSQL.
 */
@Injectable()
export class CastVoteUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly votesRepository: VotesRepository,
  ) {}

  async execute(params: {
    userId: string;
    itemId: string;
    value: number;
  }): Promise<Vote> {
    if (params.value < 1 || params.value > 10) {
      throw new BadRequestException('Nota deve ser entre 1 e 10');
    }
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const item = await tx.item.findUnique({
        where: { id: params.itemId },
      });
      if (!item) {
        throw new NotFoundException('Item não encontrado');
      }
      const member = await tx.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: params.userId,
            groupId: item.groupId,
          },
        },
      });
      if (!member) {
        throw new ForbiddenException(
          'Apenas membros do grupo podem votar neste item',
        );
      }
      return this.votesRepository.upsertVote(tx, {
        userId: params.userId,
        itemId: params.itemId,
        value: params.value,
      });
    });
  }
}
