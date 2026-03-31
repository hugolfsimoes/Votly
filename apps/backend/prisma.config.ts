import path from 'node:path';
import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: path.join(__dirname, '.env') });

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrations: {
    path: path.join(__dirname, 'prisma', 'migrations'),
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
