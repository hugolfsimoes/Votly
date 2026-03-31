import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParsePrismaIdPipe } from '../../common/pipes/parse-prisma-id.pipe';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CastVoteDto } from './dto/cast-vote.dto';
import { VotesService } from './votes.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('votes')
  cast(@CurrentUser() user: JwtPayload, @Body() dto: CastVoteDto) {
    return this.votesService.vote(user.sub, dto);
  }

  @Get('ranking')
  ranking(
    @CurrentUser() user: JwtPayload,
    @Query('groupId', new ParsePrismaIdPipe('groupId')) groupId: string,
  ) {
    return this.votesService.ranking(groupId, user.sub);
  }

  @Get('my-vote')
  myVote(
    @CurrentUser() user: JwtPayload,
    @Query('itemId', new ParsePrismaIdPipe('itemId')) itemId: string,
  ) {
    return this.votesService.myVoteForItem(itemId, user.sub);
  }
}
