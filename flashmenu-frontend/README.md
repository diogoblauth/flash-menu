# FlashMenu — Frontend

Painel administrativo (e futura vitrine pública) do FlashMenu: cardápio digital via QR code.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Quasar v2** (Quasar CLI com Webpack)
- **Pinia** + **SWRV** (estado / data fetching)
- **Axios** (HTTP, instância única em `src/boot/axios.js`)
- **vue-router** em modo `history` (URLs limpas — necessário para a vitrine pública `/<slug>`)
- **dayjs**, **lucide-vue-next**, **qrcode**
- **ESLint 9** + **Prettier**

## Como rodar

```bash
npm install        # instala deps (roda `quasar prepare` no postinstall)
npm run dev        # ambiente de desenvolvimento (http://localhost:9000)
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # build de produção (dist/)
```

A URL da API é definida em `quasar.config.js > build.env.API`
(dev: `http://localhost:5000`).

## Estrutura

```
src/
  api/          # uma função por endpoint (login.js, exemplo.js, ...)
  boot/         # inicialização (axios com interceptors de token e 401)
  components/ui/# componentes genéricos (AppPageHeader, AppEmptyState, AppActionBar)
  css/          # app.scss + quasar.variables.scss (tema/fonte Inter)
  layouts/      # AuthLayout (login) e MainLayout (painel com drawer)
  pages/        # LoginPage, IndexPage (dashboard), ErrorNotFound
  router/       # rotas + guard requiresAuth
  stores/       # Pinia (auth.js)
  util/         # notify, currency (BRL), date (timezone São Paulo)
```

## Convenções

- Componentes/páginas/layouts em **PascalCase**; pages com sufixo `Page`, layouts com `Layout`.
- Um arquivo por endpoint em `src/api/`, função `async`, JSDoc no response.
- Token persistido via `LocalStorage` (chave `'token'`);
  401 é tratado globalmente no interceptor de response.
