import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParsePrismaIdPipe } from '../../common/pipes/parse-prisma-id.pipe';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateItemDto) {
    return this.itemsService.create(user.sub, dto);
  }

  @Get()
  list(
    @CurrentUser() user: JwtPayload,
    @Query('groupId', new ParsePrismaIdPipe('groupId')) groupId: string,
  ) {
    return this.itemsService.listByGroupId(groupId, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemsService.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.itemsService.remove(user.sub, id);
  }
}
