import { Injectable } from '@nestjs/common';
import { Group, GroupMember, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithOwnerMembership(
    data: Pick<Group, 'name' | 'description' | 'ownerId'>,
  ): Promise<Group> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const group = await tx.group.create({
        data: {
          name: data.name,
          description: data.description ?? null,
          ownerId: data.ownerId,
        },
      });
      await tx.groupMember.create({
        data: { userId: data.ownerId, groupId: group.id },
      });
      return group;
    });
  }

  findById(id: string): Promise<Group | null> {
    return this.prisma.group.findUnique({ where: { id } });
  }

  update(
    id: string,
    data: Prisma.GroupUpdateInput,
  ): Promise<Group> {
    return this.prisma.group.update({ where: { id }, data });
  }

  delete(id: string): Promise<Group> {
    return this.prisma.group.delete({ where: { id } });
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const m = await this.prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    return !!m;
  }

  async listByUserId(userId: string): Promise<Group[]> {
    const members = await this.prisma.groupMember.findMany({
      where: { userId },
      include: { group: true },
    });
    return members.map((m: (typeof members)[number]) => m.group);
  }

  addMember(groupId: string, userId: string): Promise<GroupMember> {
    return this.prisma.groupMember.create({
      data: { groupId, userId },
    });
  }

  findMember(
    groupId: string,
    userId: string,
  ): Promise<GroupMember | null> {
    return this.prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
  }
}
