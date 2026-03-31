import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { GroupsRepository } from './repositories/groups.repository';
import { CreateGroupUseCase } from './use-cases/create-group.use-case';
import { DeleteGroupUseCase } from './use-cases/delete-group.use-case';
import { InviteUserToGroupUseCase } from './use-cases/invite-user-to-group.use-case';
import { ListUserGroupsUseCase } from './use-cases/list-user-groups.use-case';
import { UpdateGroupUseCase } from './use-cases/update-group.use-case';

@Module({
  imports: [UsersModule],
  controllers: [GroupsController],
  providers: [
    GroupsRepository,
    GroupsService,
    CreateGroupUseCase,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
    ListUserGroupsUseCase,
    InviteUserToGroupUseCase,
  ],
  exports: [GroupsRepository],
})
export class GroupsModule {}
