import { Module } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemsRepository } from './repositories/items.repository';
import { CreateItemUseCase } from './use-cases/create-item.use-case';
import { DeleteItemUseCase } from './use-cases/delete-item.use-case';
import { ListItemsByGroupUseCase } from './use-cases/list-items-by-group.use-case';
import { UpdateItemUseCase } from './use-cases/update-item.use-case';

@Module({
  imports: [GroupsModule],
  controllers: [ItemsController],
  providers: [
    ItemsRepository,
    ItemsService,
    CreateItemUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    ListItemsByGroupUseCase,
  ],
  exports: [ItemsRepository],
})
export class ItemsModule {}
