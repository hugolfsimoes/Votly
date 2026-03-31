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
- Instância **PostgreSQL** acessível

## Configuração

1. Clonar o repositório e instalar dependências na raiz:

   ```bash
   pnpm install
   ```

2. Na API, criar `apps/backend/.env` a partir do exemplo:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Ajustar `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` e `PORT` conforme o teu ambiente.

3. Aplicar migrações da base de dados:

   ```bash
   pnpm prisma:migrate
   ```

Em desenvolvimento com `pnpm dev`, o frontend usa o **proxy** do Vite (`/api` → API em `localhost:3000`); não é obrigatório criar `.env` no frontend. Para build/preview de produção sem proxy, vê `apps/frontend/.env.example` (`VITE_API_URL`, etc.).

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
