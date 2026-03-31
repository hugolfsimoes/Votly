import { Module } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { VotesRepository } from './repositories/votes.repository';
import { CastVoteUseCase } from './use-cases/cast-vote.use-case';
import { GetGroupRankingUseCase } from './use-cases/get-group-ranking.use-case';
import { GetMyVoteForItemUseCase } from './use-cases/get-my-vote-for-item.use-case';

@Module({
  imports: [ GroupsModule ],
  controllers: [ VotesController ],
  providers: [
    VotesRepository,
    VotesService,
    CastVoteUseCase,
    GetGroupRankingUseCase,
    GetMyVoteForItemUseCase,
  ],
})
export class VotesModule {}
