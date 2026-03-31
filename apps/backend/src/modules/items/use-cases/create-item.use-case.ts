import { Injectable, ForbiddenException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { GroupsRepository } from '../../groups/repositories/groups.repository';
import { ItemsRepository } from '../repositories/items.repository';

@Injectable()
export class CreateItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async execute(params: {
    userId: string;
    groupId: string;
    title: string;
  }): Promise<Item> {
    const isMember = await this.groupsRepository.isMember(
      params.groupId,
      params.userId,
    );
    if (!isMember) {
      throw new ForbiddenException('Você não participa deste grupo');
    }
    return this.itemsRepository.create({
      groupId: params.groupId,
      title: params.title,
    });
  }
}
