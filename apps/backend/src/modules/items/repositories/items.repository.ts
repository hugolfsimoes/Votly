import { Injectable } from '@nestjs/common';
import { Item, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { title: string; groupId: string }): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  findById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.ItemUpdateInput): Promise<Item> {
    return this.prisma.item.update({ where: { id }, data });
  }

  delete(id: string): Promise<Item> {
    return this.prisma.item.delete({ where: { id } });
  }

  listByGroupId(groupId: string): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
