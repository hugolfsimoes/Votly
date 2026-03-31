import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GroupsRepository } from '../../groups/repositories/groups.repository';
import { VotesRepository } from '../repositories/votes.repository';

/** TTL sugerido para cache (ex.: Redis): 30–120s após mutação de votos. */
@Injectable()
export class GetGroupRankingUseCase {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly votesRepository: VotesRepository,
  ) {}

  async execute(groupId: string, userId: string) {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }
    const isMember = await this.groupsRepository.isMember(groupId, userId);
    if (!isMember) {
      throw new ForbiddenException('Você não participa deste grupo');
    }
    // Cache: chave `ranking:${groupId}` — invalidar em CastVoteUseCase após sucesso.
    return this.votesRepository.rankingForGroup(groupId);
  }
}
