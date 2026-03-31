import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { GroupsRepository } from '../../groups/repositories/groups.repository';
import { ItemsRepository } from '../repositories/items.repository';

@Injectable()
export class ListItemsByGroupUseCase {
  constructor(
    private readonly itemsRepository: ItemsRepository,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async execute(groupId: string, userId: string): Promise<Item[]> {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }
    const isMember = await this.groupsRepository.isMember(groupId, userId);
    if (!isMember) {
      throw new ForbiddenException('Você não participa deste grupo');
    }
    return this.itemsRepository.listByGroupId(groupId);
  }
}
