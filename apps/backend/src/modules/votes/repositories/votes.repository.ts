import { Injectable } from '@nestjs/common';
import { Prisma, Vote } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserAndItem(userId: string, itemId: string): Promise<Vote | null> {
    return this.prisma.vote.findUnique({
      where: {
        userId_itemId: { userId, itemId },
      },
    });
  }

  upsertVote(
    tx: Prisma.TransactionClient,
    params: { userId: string; itemId: string; value: number; },
  ): Promise<Vote> {
    return tx.vote.upsert({
      where: {
        userId_itemId: {
          userId: params.userId,
          itemId: params.itemId,
        },
      },
      create: {
        userId: params.userId,
        itemId: params.itemId,
        value: params.value,
      },
      update: { value: params.value },
    });
  }

  async rankingForGroup(groupId: string): Promise<
    Array<{
      itemId: string;
      title: string;
      voteSum: number;
      voteCount: number;
      rank: number;
    }>
  > {
    const items = await this.prisma.item.findMany({
      where: { groupId },
      select: {
        id: true,
        title: true,
        votes: { select: { value: true } },
      },
    });
    type ItemRow = (typeof items)[ number ];
    const rows = items.map((item: ItemRow) => {
      const validVotes = item.votes.filter(
        (v: { value: number }) => v.value >= 1 && v.value <= 10,
      );
      const voteSum = validVotes.reduce(
        (s: number, v: { value: number }) => s + v.value,
        0,
      );
      const voteCount = validVotes.length;
      return {
        itemId: item.id,
        title: item.title,
        voteSum,
        voteCount,
      };
    });
    rows.sort(
      (
        a: (typeof rows)[ number ],
        b: (typeof rows)[ number ],
      ) => {
        if (b.voteSum !== a.voteSum) return b.voteSum - a.voteSum;
        return b.voteCount - a.voteCount;
      },
    );
    return rows.map((r: (typeof rows)[ number ], index: number) => ({
      ...r,
      rank: index + 1,
    }));
  }
}
