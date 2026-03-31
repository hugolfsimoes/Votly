import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { GroupsRepository } from '../../groups/repositories/groups.repository';
import { VotesRepository } from '../repositories/votes.repository';

@Injectable()
export class GetMyVoteForItemUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupsRepository: GroupsRepository,
    private readonly votesRepository: VotesRepository,
  ) {}

  async execute(
    itemId: string,
    userId: string,
  ): Promise<{ value: number | null }> {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }
    const isMember = await this.groupsRepository.isMember(item.groupId, userId);
    if (!isMember) {
      throw new ForbiddenException('Você não participa deste grupo');
    }
    const vote = await this.votesRepository.findByUserAndItem(userId, itemId);
    const v = vote?.value;
    if (v == null || v < 1 || v > 10) {
      return { value: null };
    }
    return { value: v };
  }
}
