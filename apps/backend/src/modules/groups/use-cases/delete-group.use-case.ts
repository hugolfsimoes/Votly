import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Group } from '@prisma/client';
import { GroupsRepository } from '../repositories/groups.repository';

@Injectable()
export class DeleteGroupUseCase {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async execute(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }
    if (group.ownerId !== userId) {
      throw new ForbiddenException('Apenas o dono pode remover o grupo');
    }
    return this.groupsRepository.delete(groupId);
  }
}
