import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupUseCase } from './use-cases/create-group.use-case';
import { DeleteGroupUseCase } from './use-cases/delete-group.use-case';
import { InviteUserToGroupUseCase } from './use-cases/invite-user-to-group.use-case';
import { ListUserGroupsUseCase } from './use-cases/list-user-groups.use-case';
import { UpdateGroupUseCase } from './use-cases/update-group.use-case';

@Injectable()
export class GroupsService {
  constructor(
    private readonly createGroup: CreateGroupUseCase,
    private readonly updateGroup: UpdateGroupUseCase,
    private readonly deleteGroup: DeleteGroupUseCase,
    private readonly listUserGroups: ListUserGroupsUseCase,
    private readonly inviteUser: InviteUserToGroupUseCase,
  ) {}

  create(userId: string, dto: CreateGroupDto) {
    return this.createGroup.execute({
      ownerId: userId,
      name: dto.name,
      description: dto.description,
    });
  }

  update(userId: string, groupId: string, dto: UpdateGroupDto) {
    return this.updateGroup.execute({
      groupId,
      userId,
      name: dto.name,
      description: dto.description,
    });
  }

  remove(userId: string, groupId: string) {
    return this.deleteGroup.execute(groupId, userId);
  }

  listMine(userId: string) {
    return this.listUserGroups.execute(userId);
  }

  invite(userId: string, groupId: string, dto: InviteMemberDto) {
    return this.inviteUser.execute({
      groupId,
      inviterUserId: userId,
      inviteeEmail: dto.email,
    });
  }
}
