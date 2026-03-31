import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { GroupsRepository } from '../../groups/repositories/groups.repository';
import { ItemsRepository } from '../repositories/items.repository';

@Injectable()
export class DeleteItemUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async execute(userId: string, itemId: string): Promise<Item> {
    const item = await this.itemsRepository.findById(itemId);
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }
    const isMember = await this.groupsRepository.isMember(
      item.groupId,
      userId,
    );
    if (!isMember) {
      throw new ForbiddenException('Você não participa deste grupo');
    }
    return this.itemsRepository.delete(itemId);
  }
}
