# Votly

Aplicação para **votação em grupo**: utilizadores criam grupos, convidam membros, adicionam itens a votar e registam votos (um voto por utilizador e por item, com valor configurável). O ranking por grupo está disponível na API.

## Monorepo

| Pasta | Descrição |
|-------|-----------|
| `apps/backend` (`votly-api`) | API REST em **NestJS** — autenticação JWT, grupos, itens e votos |
| `apps/frontend` (`votly-web`) | Interface em **React 19** + **Vite** + **Tailwind CSS** |
| `packages/ui` | Componentes partilhados (`@votly/ui`) |
| `packages/config` | Configuração partilhada entre pacotes |

Gestor de pacotes: **pnpm** (workspaces).

## Stack principal

- **Node.js** ≥ 20  
- **PostgreSQL** + **Prisma** (ORM e migrações)  
- **Passport JWT** no backend  
- Proxy do frontend: pedidos a `/api` são reencaminhados para a API (porta por defeito `3000`)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior  
- [pnpm](https://pnpm.io/) 9 (versão alinhada com `package.json` na raiz)  
- Instância **PostgreSQL** acessível (podes usar [Supabase](https://supabase.com/) no plano gratuito)

## Base de dados no Supabase

O Votly usa **PostgreSQL** via Prisma; o Supabase serve como base gerida.

1. Cria um projeto em [supabase.com](https://supabase.com/) e abre o **SQL Editor**.
2. Executa o script `apps/backend/prisma/supabase-prisma-user.sql` (altera a palavra-passe no `CREATE USER` antes de correr).
3. Em **Project Settings → Database → Connect**, copia a connection string do **pooler em modo Session** (porta **5432**).  
   - Com **Prisma 7** e API Nest de longa duração, esta mesma URL serve para a aplicação e para `prisma migrate`.  
   - Evita usar **só** o modo Transaction (porta **6543**) como única URL: as migrações podem falhar ou bloquear.
4. Cola essa URI inteira em `DATABASE_URL` no `apps/backend/.env` (uma linha, aspas fechadas). Se criaste o user `prisma` no SQL, usa o formato de utilizador que o painel indica para Prisma (muitas vezes `postgres.[REF]` ou `prisma.[REF]` na parte antes do `@`).
5. Se a string não incluir SSL, acrescenta `?sslmode=require` (ou `&sslmode=require` se já houver query).

### Erro P1001 — “Can’t reach database server” em `db.….supabase.co`

Isso quase sempre significa que o `DATABASE_URL` ainda usa **Direct connection** (`db.<projeto>.supabase.co`). Em redes só **IPv4**, esse host muitas vezes **não é alcançável**.

**O que fazer:** no Supabase, **Connect** → **Direct** → em **Connection method** escolhe **Session pooler** (porta **5432**) → copia a **URI** e **substitui por completo** o valor de `DATABASE_URL`.

**Como confirmar:** ao correr `pnpm prisma:migrate`, o Prisma já **não** deve mostrar `db.xxx.supabase.co` no datasource; deve aparecer um host do tipo **`* .pooler.supabase.com`**. Se ainda aparecer `db.…`, o `.env` não foi atualizado com a string do pooler.

Documentação oficial: [Supabase + Prisma](https://supabase.com/docs/guides/database/prisma).

### Circuit breaker — `migrate resolve` também falha

O comando `prisma migrate resolve` **liga à mesma** `DATABASE_URL`; se o pooler responder *Circuit breaker open*, não consegues marcar migrações pelo CLI.

**Contorno:** no **SQL Editor** do Supabase (não passa pelo pooler da tua rede):

1. Correr o SQL das tabelas: `apps/backend/prisma/migrations/20250331120000_init/migration.sql`
2. Depois correr: `apps/backend/prisma/supabase-mark-init-applied.sql` (cria `_prisma_migrations` e regista `20250331120000_init` com o checksum correto do ficheiro de migração).

Quando o pooler voltar a aceitar ligações, `pnpm prisma:migrate` e a API Nest podem usar a mesma `DATABASE_URL` de sempre.

## Configuração

1. Clonar o repositório e instalar dependências na raiz:

   ```bash
   pnpm install
   ```

2. Na API, criar `apps/backend/.env` a partir do exemplo:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Ajustar `DATABASE_URL` (local ou Supabase; vê secção acima), `JWT_SECRET`, `JWT_EXPIRES_IN` e `PORT`.

3. Aplicar migrações da base de dados:

   ```bash
   pnpm prisma:migrate
   ```

Em desenvolvimento com `pnpm dev`, o frontend usa o **proxy** do Vite (`/api` → API em `localhost:3000`); não é obrigatório criar `.env` no frontend. Para build/preview de produção sem proxy, vê `apps/frontend/.env.example` (`VITE_API_URL`, etc.).

O assistente do Supabase para **Next.js** (`.env.local`, `NEXT_PUBLIC_*`, `@supabase/ssr`, middleware) **não se aplica** a este repo: o web é **Vite + React**. Para um cliente Supabase no browser existe `apps/frontend/src/lib/supabase.ts` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (opcional; a API Nest + Prisma continua a ser a fonte dos dados do Votly).

## Scripts (raiz do repositório)

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Sobe a API e, em seguida, o frontend em desenvolvimento |
| `pnpm dev:api` | Apenas NestJS (watch) |
| `pnpm dev:web` | Apenas Vite |
| `pnpm build` | Build da API e do frontend |
| `pnpm lint` | ESLint na API |
| `pnpm prisma:generate` | Gera o cliente Prisma |
| `pnpm prisma:migrate` | Migrações em desenvolvimento (`prisma migrate dev` na API) |

Na pasta `apps/backend` podes usar também `pnpm prisma:studio` para inspecionar dados.

## API (resumo)

- `GET /health` — estado do serviço  
- `POST /auth/signup` e `POST /auth/signin` — registo e login (JWT nas rotas protegidas)  
- Rotas protegidas (Bearer): grupos (`/groups`), itens (`/items`), votos (`POST /votes`), ranking (`GET /ranking`), voto atual (`GET /my-vote`)

Com o frontend em desenvolvimento, o proxy usa o prefixo `/api` (ver `apps/frontend/vite.config.ts`).

## Modelo de dados (conceito)

- **User** — conta com email e palavra-passe (hash)  
- **Group** — pertence a um dono; **GroupMember** liga utilizadores ao grupo  
- **Item** — candidato a votar dentro de um grupo  
- **Vote** — um registo por par (utilizador, item), com campo `value`

---

Projeto privado **votly** — monorepo gerido com pnpm workspaces.
