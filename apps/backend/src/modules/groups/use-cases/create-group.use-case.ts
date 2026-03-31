import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { GroupsRepository } from '../repositories/groups.repository';

@Injectable()
export class CreateGroupUseCase {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  execute(params: {
    ownerId: string;
    name: string;
    description?: string;
  }): Promise<Group> {
    return this.groupsRepository.createWithOwnerMembership({
      ownerId: params.ownerId,
      name: params.name,
      description: params.description ?? null,
    });
  }
}
