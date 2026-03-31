import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateItemUseCase } from './use-cases/create-item.use-case';
import { DeleteItemUseCase } from './use-cases/delete-item.use-case';
import { ListItemsByGroupUseCase } from './use-cases/list-items-by-group.use-case';
import { UpdateItemUseCase } from './use-cases/update-item.use-case';

@Injectable()
export class ItemsService {
  constructor(
    private readonly createItem: CreateItemUseCase,
    private readonly updateItem: UpdateItemUseCase,
    private readonly deleteItem: DeleteItemUseCase,
    private readonly listByGroup: ListItemsByGroupUseCase,
  ) {}

  create(userId: string, dto: CreateItemDto) {
    return this.createItem.execute({
      userId,
      groupId: dto.groupId,
      title: dto.title,
    });
  }

  update(userId: string, itemId: string, dto: UpdateItemDto) {
    return this.updateItem.execute({
      userId,
      itemId,
      title: dto.title,
    });
  }

  remove(userId: string, itemId: string) {
    return this.deleteItem.execute(userId, itemId);
  }

  listByGroupId(groupId: string, userId: string) {
    return this.listByGroup.execute(groupId, userId);
  }
}
