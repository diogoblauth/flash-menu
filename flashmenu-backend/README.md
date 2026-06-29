# FlashMenu — Backend

API REST do FlashMenu: cardápio digital via QR code para restaurantes, lanchonetes e bares.

## Stack

- **Node.js** (ES Modules)
- **Express 5**
- **Prisma 6** + **PostgreSQL 16** (via Docker)
- **JWT** (jsonwebtoken) + **bcrypt**
- **Zod** — validação de entrada
- **helmet**, **cors**, **express-rate-limit** — segurança
- **nodemon** — auto-reload em desenvolvimento
- **ESLint 9** + **Prettier**

## Pré-requisitos

- Node.js `v22+`
- Docker Desktop rodando

## Como rodar

```bash
# 1. Copie as variáveis de ambiente
cp .env.example .env

# 2. Instale as dependências
npm install

# 3. Suba o banco e inicie o servidor
npm run dev
```

O `npm run dev` faz três coisas em sequência:
1. `docker compose up -d` — sobe o PostgreSQL 16 em background
2. `prisma db push` — sincroniza o schema com o banco
3. `nodemon` — inicia o servidor com auto-reload em `http://localhost:5000`

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://postgres:postgres@localhost:5432/flashmenu_db` |
| `JWT_SECRET` | Segredo para assinar os tokens JWT | string longa e aleatória |
| `PORT` | Porta do servidor (padrão: 5000) | `5000` |

## Scripts

```bash
npm run dev          # Docker + prisma db push + nodemon
npm run start        # Inicia o servidor sem Docker/migrations (produção)
npm run lint         # ESLint
npm run format       # Prettier
npm run db:push      # Sincroniza schema.prisma com o banco (sem criar arquivos de migration)
npm run db:migrate   # Cria e aplica uma migration versionada
npm run db:studio    # Abre o Prisma Studio (GUI do banco)
```

## Estrutura

```
src/
  index.js              # entry point — app.listen
  app.js                # Express: middlewares globais + rotas + error handler
  database/
    prisma.js           # singleton do PrismaClient
  core/
    auth/jwt.js         # createToken / verifyToken (puro, sem efeito colateral)
    errors/http-errors.js  # BadRequestError, UnauthorizedError, NotFoundError, ConflictError
  middleware/
    verify-token.js     # middleware authenticate — valida Bearer token
    error-handler.js    # handler global: ZodError → 400, httpStatus, 500
  controllers/          # rotas + validação Zod (uma função por endpoint)
    auth.js             # POST /login  |  POST /restaurante
    restaurant.js       # GET /restaurante  |  PUT /restaurante
    menu.js             # GET /cardapio/:slug (stub — a implementar)
  services/             # lógica de negócio
    auth.js             # valida credenciais, gera token
    restaurant.js       # gera slug único, hash da senha, cadastra restaurante
  repositories/
    restaurant.js       # queries Prisma: findByEmail, findBySlug, findById, create, update
prisma/
  schema.prisma         # modelos: Restaurant, Category, Item
```

## Modelos

```
Restaurant  →  id, name, slug (único, imutável), email, password, description,
               logo, primaryColor, createdAt
Category    →  id, name, sortOrder, restaurantId
Item        →  id, name, description, price, photo, active, sortOrder,
               restaurantId, categoryId (opcional)
```

## Endpoints

### Públicos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/restaurante` | Cadastra novo restaurante — retorna `{ token, restaurant }` |
| `POST` | `/login` | Autentica restaurante — retorna `{ token, restaurant }` |
| `GET` | `/cardapio/:slug` | Vitrine pública por slug (stub, retorna 501) |

### Autenticados (Bearer token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/restaurante` | Retorna perfil do restaurante autenticado |
| `PUT` | `/restaurante` | Atualiza name, description, logo, primaryColor |

## Convenções

- Um arquivo por endpoint em `src/controllers/`; validação Zod no controller, lógica no service, query no repository.
- Erros HTTP lançados como classes (`throw new NotFoundError(...)`) — capturados pelo `error-handler` global.
- Variáveis prefixadas com `_` são ignoradas pelo ESLint (`_req`, `_next`).
- `JWT_SECRET` obrigatório via env — nunca hardcoded.
- Rate limiting ativo apenas em produção (`NODE_ENV=production`).

## Próximos passos

CRUD de categorias e itens, upload de foto (multer), vitrine pública completa (`/cardapio/:slug`), geração do QR code.
