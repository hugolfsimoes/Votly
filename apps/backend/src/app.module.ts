import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ItemsModule } from './modules/items/items.module';
import { VotesModule } from './modules/votes/votes.module';
import { PrismaModule } from './prisma/prisma.module';

/** Garante `apps/backend/.env` mesmo quando o cwd não é a pasta da API (ex.: monorepo). */
function resolveBackendEnvPath(): string | undefined {
  const candidates = [
    join(__dirname, '..', '..', '.env'),
    join(__dirname, '..', '.env'),
    join(process.cwd(), '.env'),
  ];
  return candidates.find((p) => existsSync(p));
}

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolveBackendEnvPath(),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    ItemsModule,
    VotesModule,
  ],
})
export class AppModule {}
