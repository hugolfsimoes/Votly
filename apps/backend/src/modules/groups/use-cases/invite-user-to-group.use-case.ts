import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { GroupMember } from '@prisma/client';
import { UsersRepository } from '../../users/repositories/users.repository';
import { GroupsRepository } from '../repositories/groups.repository';

@Injectable()
export class InviteUserToGroupUseCase {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(params: {
    groupId: string;
    inviterUserId: string;
    inviteeEmail: string;
  }): Promise<GroupMember> {
    const group = await this.groupsRepository.findById(params.groupId);
    if (!group) {
      throw new NotFoundException('Grupo não encontrado');
    }
    const inviterIsMember = await this.groupsRepository.isMember(
      params.groupId,
      params.inviterUserId,
    );
    if (!inviterIsMember) {
      throw new ForbiddenException('Você não participa deste grupo');
    }
    const invitee = await this.usersRepository.findByEmail(params.inviteeEmail);
    if (!invitee) {
      throw new NotFoundException('Usuário com este e-mail não existe');
    }
    const already = await this.groupsRepository.findMember(
      params.groupId,
      invitee.id,
    );
    if (already) {
      throw new ConflictException('Usuário já é membro do grupo');
    }
    return this.groupsRepository.addMember(params.groupId, invitee.id);
  }
}
