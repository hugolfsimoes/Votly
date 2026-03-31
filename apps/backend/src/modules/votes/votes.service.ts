import { Injectable } from '@nestjs/common';
import { CastVoteDto } from './dto/cast-vote.dto';
import { CastVoteUseCase } from './use-cases/cast-vote.use-case';
import { GetGroupRankingUseCase } from './use-cases/get-group-ranking.use-case';
import { GetMyVoteForItemUseCase } from './use-cases/get-my-vote-for-item.use-case';

@Injectable()
export class VotesService {
  constructor(
    private readonly castVote: CastVoteUseCase,
    private readonly getRanking: GetGroupRankingUseCase,
    private readonly getMyVoteForItem: GetMyVoteForItemUseCase,
  ) {}

  vote(userId: string, dto: CastVoteDto) {
    return this.castVote.execute({
      userId,
      itemId: dto.itemId,
      value: dto.value,
    });
  }

  ranking(groupId: string, userId: string) {
    return this.getRanking.execute(groupId, userId);
  }

  myVoteForItem(itemId: string, userId: string) {
    return this.getMyVoteForItem.execute(itemId, userId);
  }
}
