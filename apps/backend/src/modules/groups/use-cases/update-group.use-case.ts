import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Group } from '@prisma/client';
import { GroupsRepository } from '../repositories/groups.repository';

@Injectable()
export class UpdateGroupUseCase {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async execute(params: {
    groupId: string;
    userId: string;
    name?: string;
    description?: string;
  }): Promise<Group> {
    const group = await this.groupsRepository.findById(params.groupId);
    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }
    if (group.ownerId !== params.userId) {
      throw new ForbiddenException('Apenas o dono pode editar o grupo');
    }
    return this.groupsRepository.update(params.groupId, {
      ...(params.name !== undefined && { name: params.name }),
      ...(params.description !== undefined && {
        description: params.description,
      }),
    });
  }
}
