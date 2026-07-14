# FlashMenu — Backend

API REST do FlashMenu: cardápio digital via QR code para restaurantes, lanchonetes e bares.

## Stack

- **Node.js** (ES Modules)
- **Express 5**
- **Prisma 6** + **PostgreSQL 16** (via Docker)
- **JWT** (jsonwebtoken) + **bcrypt**
- **Zod** — validação de entrada
- **helmet**, **cors**, **express-rate-limit** — segurança
- **Cloudinary** + **multer** — upload e armazenamento de fotos
- **qrcode** — geração do QR code da vitrine
- **nodemon** — auto-reload em desenvolvimento
- **ESLint 9** + **Prettier**

## Pré-requisitos

- Node.js `v22+`
- Docker Desktop rodando
- Conta no Cloudinary (upload de fotos)

## Como rodar

```bash
# 1. Copie as variáveis de ambiente
cp .env.example .env

# 2. Instale as dependências
npm install

# 3. Suba o banco e inicie o servidor
npm run dev
```

O `npm run dev` executa o hook `predev` e depois o servidor, em sequência:

1. `docker compose up -d` — sobe o PostgreSQL 16 em background (porta 5432)
2. `prisma db push` — sincroniza o schema com o banco
3. `nodemon` — inicia a API com auto-reload em `http://localhost:5000`

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://postgres:postgres@localhost:5432/flashmenu_db` |
| `JWT_SECRET` | Segredo para assinar os tokens JWT | string longa e aleatória |
| `PORT` | Porta do servidor (padrão: 5000) | `5000` |
| `NODE_ENV` | Ambiente — ativa rate limiting quando `production` | `development` |
| `FRONTEND_URL` | Base usada para montar a URL do QR code | `http://localhost:9000` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name da conta Cloudinary | `seu-cloud-name` |
| `CLOUDINARY_API_KEY` | API key do Cloudinary | — |
| `CLOUDINARY_API_SECRET` | API secret do Cloudinary | — |

## Scripts

```bash
npm run dev          # predev (Docker + prisma db push) + nodemon
npm run start        # inicia o servidor sem Docker/migrations (produção)
npm run lint         # ESLint
npm run format       # Prettier
npm run db:push      # sincroniza schema.prisma com o banco (sem arquivos de migration)
npm run db:migrate   # cria e aplica uma migration versionada
npm run db:studio    # abre o Prisma Studio (GUI do banco)
```

## Arquitetura

Camadas com uma única direção de dependência:

```
routes  →  services  →  repositories  →  Prisma
```

- **routes/** — HTTP + validação Zod; lançam erros tipados e delegam a lógica.
- **services/** — regras de negócio (ex.: gerar slug, hash de senha, trocar senha).
- **repositories/** — **único ponto que fala com o Prisma**.

`app.js` monta a aplicação Express: `helmet`, `cors` (localhost em dev, `CORS_ORIGIN` em produção),
`express.json({ limit: '1mb' })`, rate limiter global, rotas em `/api/v1`, handler de 404 e o
`errorHandler` global. Os erros são lançados como classes de `core/errors/http-errors.js`
(`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`) e o
`error-handler` os traduz — além de formatar `ZodError` como 400.

### Estrutura de pastas

```
src/
  index.js                 # entry point — app.listen
  app.js                   # Express: middlewares globais + rotas + error handler
  config/
    cloudinary.js          # configuração do SDK Cloudinary
  core/
    auth/jwt.js            # createToken / verifyToken (puros)
    errors/http-errors.js  # classes de erro HTTP
    slug.js                # geração de slug
  database/
    prisma.js              # singleton do PrismaClient
  middleware/
    authenticate.js        # valida Bearer token → req.decoded.restaurantId
    error-handler.js       # handler global (ZodError → 400, httpStatus, 500)
    rate-limiter.js        # globalLimiter, loginLimiter, registerLimiter
    upload.js              # multer (memória) para o endpoint de upload
  repositories/            # queries Prisma
    restaurant.js  category.js  item.js  dashboard.js  upload.js
  routes/
    index.js               # monta todos os routers em /api/v1
    auth.routes.js  restaurant.routes.js  category.routes.js
    item.routes.js  upload.routes.js  dashboard.routes.js  public.routes.js
  services/
    auth.js                # login, register, getMe
    account.js             # troca de senha
  validation/              # schemas Zod
    auth.js  restaurant.js  category.js  item.js
prisma/
  schema.prisma            # modelos: Restaurant, Category, Item
```

## Modelos (Prisma)

```
Restaurant  →  id, name, slug (único, editável), email (único), password,
               description, logo, banner, primaryColor, openingHours (Json),
               createdAt
Category    →  id, name, sortOrder, restaurantId
Item        →  id, name, description, price (Decimal 10,2), photo, active,
               sortOrder, restaurantId, categoryId (opcional → item "sem categoria"),
               createdAt, updatedAt
```

## Endpoints

Todas as rotas ficam sob o prefixo `/api/v1`. Recursos do próprio restaurante ficam sob
`/restaurants/me/...` — o escopo é sempre o restaurante autenticado (nunca um id no path).

### Públicos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastra restaurante — retorna `{ token, restaurant }` (201) |
| `POST` | `/auth/login` | Autentica — retorna `{ token, restaurant }` |
| `GET` | `/public/:slug` | Vitrine pública — `{ restaurant, categories, uncategorizedItems }` (404 se o slug não existe) |

### Autenticados (Bearer token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/auth/me` | Valida o token e retorna o restaurante autenticado |
| `GET` | `/restaurants/me` | Perfil do restaurante |
| `PUT` | `/restaurants/me` | Atualiza perfil (nome, descrição, slug, cor, logo, banner, horários) |
| `PUT` | `/restaurants/me/password` | Troca de senha (confirma a senha atual) |
| `GET` | `/restaurants/me/categories` | Lista categorias |
| `POST` | `/restaurants/me/categories` | Cria categoria (201) |
| `PUT` | `/restaurants/me/categories/reorder` | Reordena categorias |
| `PUT` | `/restaurants/me/categories/:id` | Renomeia categoria |
| `DELETE` | `/restaurants/me/categories/:id` | Exclui categoria (bloqueado se houver itens vinculados) |
| `GET` | `/restaurants/me/items` | Lista itens |
| `POST` | `/restaurants/me/items` | Cria item (201) |
| `PUT` | `/restaurants/me/items/reorder` | Reordena itens |
| `PATCH` | `/restaurants/me/items/:id/active` | Ativa/desativa item na vitrine |
| `PUT` | `/restaurants/me/items/:id` | Atualiza item |
| `DELETE` | `/restaurants/me/items/:id` | Exclui item |
| `GET` | `/restaurants/me/dashboard` | Estatísticas do painel |
| `GET` | `/restaurants/me/qrcode` | QR code da vitrine (PNG, aponta para `FRONTEND_URL/<slug>`) |
| `POST` | `/uploads` | Upload de imagem (multipart, campo `file`) → Cloudinary; retorna `{ url }` (201) |

## Convenções de segurança

- **Senha**: mínimo 8, máximo 128 caracteres — o teto previne DoS de bcrypt (que trunca silenciosamente
  em 72 bytes).
- **Respostas de auth genéricas** — nunca revelam se o e-mail existe.
- **Rate limiting** ativo apenas em produção (`NODE_ENV=production`): login 10/15min, register 5/hora,
  global 1000/15min.
- **Ownership** sempre validado via `req.decoded.restaurantId`; recursos sob `/restaurants/me/...`,
  nunca por id no path.
- **JWT** expira em ~10h; `JWT_SECRET` obrigatório via env, nunca hardcoded.
- **CORS**: em dev permite qualquer porta `localhost`; em produção usa `CORS_ORIGIN`.
- `express.json` limitado a 1mb (uploads passam por multer, não por JSON).
- Erros HTTP lançados como classes (`throw new NotFoundError(...)`), capturados pelo `error-handler`.
