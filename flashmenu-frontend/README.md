# FlashMenu — Frontend

SPA do FlashMenu: painel administrativo do restaurante **e** vitrine pública do cardápio (white-label),
acessada por QR code.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Quasar v2** (Quasar CLI com Webpack)
- **Pinia** + **SWRV** (estado / data fetching)
- **Axios** (HTTP, instância única em `src/boot/axios.js`)
- **vue-router** em modo `history` (URLs limpas — necessário para a vitrine pública `/<slug>`)
- **lucide-vue-next** (ícones), **dayjs**, **qrcode**
- **vuedraggable** (ordenar categorias/itens), **vue-advanced-cropper** (recorte de imagem)
- **ESLint 9** + **Prettier**

## Como rodar

```bash
npm install        # instala deps (roda `quasar prepare` no postinstall)
npm run dev        # ambiente de desenvolvimento (http://localhost:9000)
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # build de produção (dist/)
```

A URL da API é definida em `quasar.config.js > build.env.API` (dev: `http://localhost:5000`) e lida
como `process.env.API` em `src/boot/axios.js`. O backend precisa estar rodando.

## Rotas e layouts

Três zonas, definidas em `src/router/routes.js` e protegidas pelos guards em `src/router/index.js`:

| Zona | Layout | Rotas | Meta |
|---|---|---|---|
| **Auth** | `AuthLayout` | `/login`, `/cadastro` | `isPublicOnly` — redireciona para `/dashboard` se já logado |
| **Admin** | `MainLayout` | `/dashboard`, `/categorias`, `/itens`, `/configuracoes` | `requiresAuth` — redireciona para `/login` sem token |
| **Vitrine** | `StorefrontLayout` | `/:slug` | pública e anônima (white-label) |

> As rotas estáticas têm prioridade sobre o catch-all de slug (`/:slug`), que por sua vez vem antes do
> 404 (`/:catchAll`).

## Fluxo de sessão

Token e restaurante são persistidos no `LocalStorage` do Quasar (`src/stores/auth.js`).

- **Boot** (`src/boot/axios.js`): se houver token persistido, ele é revalidado via `GET /auth/me` antes
  da primeira navegação; se inválido/expirado, a sessão é limpa.
- **Interceptor de request**: injeta `Authorization: Bearer <token>` automaticamente.
- **Interceptor de response**: em `401`, limpa a sessão e redireciona para `/login`.

## Estrutura de pastas

```
src/
  api/          # um wrapper Axios por recurso: auth, categories, items,
                #   uploads, dashboard, restaurant, public
  boot/         # axios.js — instância, interceptors e validação de sessão no startup
  components/
    ui/         # genéricos: AppPageHeader, AppEmptyState, AppActionBar,
                #   AppImageUpload, AppImageCropDialog
    categories/ items/ storefront/ dashboard/ settings/   # componentes por domínio
  css/          # app.scss, quasar.variables.scss (tema/Inter), storefront.scss
  layouts/      # AuthLayout, MainLayout (drawer do admin), StorefrontLayout
  pages/
    auth/       # LoginPage, RegisterPage
    admin/      # DashboardPage, CategoriesPage, ItemsPage, ProfilePage
    storefront/ # StorefrontPage
    ErrorNotFound.vue
  router/       # routes.js (metas) + index.js (guards requiresAuth / isPublicOnly)
  stores/       # Pinia — auth.js
  util/         # notify, currency (BRL), date, color, openingHours
```

## Convenções

- **Camadas**: `api/*.js` (wrappers Axios, uma função `async` por endpoint) ← consumidos por
  pages/components.
- Componentes/páginas/layouts em **PascalCase**; pages com sufixo `Page`, layouts com `Layout`.
- Token persistido via `LocalStorage` (chave `'token'`); 401 tratado globalmente no interceptor.

## Design System — "Ember"

Identidade visual documentada em [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md). Cor primária verde profundo
(`#166534`), sidebar `#14532D`, fonte Inter. Regras duras:

- **Nunca usar azul** no admin.
- **Nunca usar Material Icons** em componentes novos — apenas **Lucide**.
- A **vitrine pública nunca menciona "FlashMenu"** (é white-label).
- Cards sempre com `border: 1px solid var(--fm-border)` + `box-shadow-xs`.
