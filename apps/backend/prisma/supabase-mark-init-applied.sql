-- Marcar a migração inicial como aplicada SEM usar o Prisma CLI (útil quando o pooler
-- devolve "Circuit breaker open" e `migrate resolve` não consegue ligar).
--
-- Pré-requisito: já correste o SQL de `migrations/20250331120000_init/migration.sql`
-- no SQL Editor (tabelas User, Group, Item, Vote, etc. existem).
--
-- Executar: Supabase → SQL → New query → Run.

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" (
    "id",
    "checksum",
    "finished_at",
    "migration_name",
    "logs",
    "rolled_back_at",
    "started_at",
    "applied_steps_count"
)
SELECT
    gen_random_uuid()::text,
    '876b546f26733dcccb9b73a8467a951031860f08d743625967880529b07adbc6',
    CURRENT_TIMESTAMP(3),
    '20250331120000_init',
    NULL,
    NULL,
    CURRENT_TIMESTAMP(3),
    1
WHERE NOT EXISTS (
    SELECT 1 FROM "_prisma_migrations" m WHERE m.migration_name = '20250331120000_init'
);
