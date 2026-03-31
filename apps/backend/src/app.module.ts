import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ItemsModule } from './modules/items/items.module';
import { VotesModule } from './modules/votes/votes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    ItemsModule,
    VotesModule,
  ],
})
export class AppModule {}
