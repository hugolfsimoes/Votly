import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { GroupsRepository } from '../repositories/groups.repository';

@Injectable()
export class ListUserGroupsUseCase {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  execute(userId: string): Promise<Group[]> {
    return this.groupsRepository.listByUserId(userId);
  }
}
