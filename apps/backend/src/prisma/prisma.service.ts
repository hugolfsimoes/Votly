import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

/**
 * O `pg` faz merge `Object.assign({}, config, parse(connectionString))`, pelo que
 * `sslmode=require` na URL gera `ssl: {}` e **substitui** `ssl: { rejectUnauthorized: false }`.
 * Com `sslmode=no-verify`, o parser define `rejectUnauthorized: false` correctamente.
 * @see https://github.com/brianc/node-postgres/issues (pg-connection-string + sslmode)
 */
function pgConnectionStringWithRelaxedTls(url: string): string {
  if (/\bsslmode=require\b/i.test(url)) {
    return url.replace(/\bsslmode=require\b/gi, 'sslmode=no-verify');
  }
  if (!/\bsslmode=/i.test(url)) {
    return `${url}${url.includes('?') ? '&' : '?'}sslmode=no-verify`;
  }
  return url;
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(config: ConfigService) {
    const rawUrl = config.getOrThrow<string>('DATABASE_URL');
    const hostUsesTls =
      /\.supabase\.co|pooler\.supabase\.com|sslmode=require|ssl=true/i.test(
        rawUrl,
      );
    const sslMode = config.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED');
    const rejectUnauthorized =
      sslMode === 'true'
        ? true
        : sslMode === 'false'
          ? false
          : !hostUsesTls;
    const connectionString =
      hostUsesTls && !rejectUnauthorized
        ? pgConnectionStringWithRelaxedTls(rawUrl)
        : rawUrl;
    const pool = new Pool({ connectionString });
    super({ adapter: new PrismaPg(pool) });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
