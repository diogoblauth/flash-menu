# FlashMenu

Cardápio digital via QR code para restaurantes, lanchonetes e bares.

O dono do estabelecimento gerencia o cardápio em um **painel administrativo** (categorias, itens,
fotos, preços, horários) e os clientes acessam uma **vitrine pública white-label** pelo endereço
`https://.../<slug>` — normalmente através de um QR code impresso na mesa.

---

## Arquitetura

Monorepo com dois pacotes npm independentes:

| Pasta | O que é | README |
|---|---|---|
| [`flashmenu-backend/`](./flashmenu-backend) | API REST (Express 5 + Prisma + PostgreSQL) | [ver](./flashmenu-backend/README.md) |
| [`flashmenu-frontend/`](./flashmenu-frontend) | SPA (Vue 3 + Quasar 2) — admin + vitrine | [ver](./flashmenu-frontend/README.md) |

Fluxo de uma requisição:

```
Navegador (Quasar SPA)  ──HTTP──▶  API /api/v1 (Express)  ──▶  Prisma  ──▶  PostgreSQL
                                          │
                                          └── uploads de imagem ──▶ Cloudinary
```

O backend é organizado em camadas com uma única direção de dependência:
`routes → services → repositories → Prisma`. Os repositórios são o único ponto que fala com o banco.

## Stack

**Backend:** Express 5, Prisma 6, PostgreSQL 16, JWT + bcrypt, Zod (validação), helmet,
express-rate-limit, Cloudinary + multer (upload de fotos), qrcode.

**Frontend:** Vue 3 (Composition API), Quasar 2 (CLI Webpack), Pinia, Axios, vue-router (modo history),
Lucide (ícones), dayjs.

## Pré-requisitos

- **Node.js 22+**
- **Docker Desktop** rodando (o banco sobe via `docker compose`)
- Conta no **Cloudinary** (para upload de fotos)

## Como rodar (desenvolvimento)

Abra dois terminais — um para cada pacote.

**1. Backend** (`http://localhost:5000`)

```bash
cd flashmenu-backend
cp .env.example .env      # preencha JWT_SECRET e as credenciais do Cloudinary
npm install
npm run dev               # sobe o PostgreSQL no Docker, sincroniza o schema e inicia a API
```

**2. Frontend** (`http://localhost:9000`)

```bash
cd flashmenu-frontend
npm install
npm run dev
```

A URL da API que o frontend consome é definida em `flashmenu-frontend/quasar.config.js`
(padrão de dev: `http://localhost:5000`).

## Estrutura do repositório

```
flashmenu/
├── flashmenu-backend/    # API REST — ver README próprio
├── flashmenu-frontend/   # SPA Vue/Quasar — ver README próprio
└── README.md             # este arquivo
```

## Fluxo do produto

1. **Cadastro** do restaurante → recebe token + registro.
2. **Login** no painel administrativo.
3. **Montar o cardápio** — criar categorias e itens, com fotos e preços.
4. **Configurar o perfil** — nome, descrição, slug da vitrine, cor primária, logo, banner e horários.
5. **Gerar o QR code** que aponta para a vitrine pública.
6. Clientes acessam a **vitrine pública** anônima em `/<slug>`.

## Design System

A identidade visual do frontend segue o Design System **"Ember"**, documentado em
[`flashmenu-frontend/DESIGN-SYSTEM.md`](./flashmenu-frontend/DESIGN-SYSTEM.md).
