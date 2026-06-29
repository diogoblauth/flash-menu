# FlashMenu Design System — "Ember"

## Filosofia

> Quente, preciso, invisível para o cliente final.

O painel administrativo deve parecer uma cozinha profissional organizada: materiais naturais, superfícies limpas, tudo no seu lugar. Não é um dashboard de startup genérico. É uma ferramenta de trabalho para donos de restaurante brasileiros.

**Princípios:**
- **Quente, não frio** — stone/âmbar em vez de slate/azul
- **Editorial, não decorativo** — tipografia com intenção, não ícones coloridos por padrão
- **Bordas antes de sombras** — `1px solid` é mais limpo que box-shadow excessivo
- **Densidade moderada** — respiro suficiente sem desperdiçar espaço

---

## Paleta de Cores

Todos os tokens estão definidos em `src/css/app.scss` como CSS custom properties.

### Accent — Verde Profundo (forest green)

| Token | Valor | Uso |
|---|---|---|
| `--fm-brand` | `#166534` (green-800) | Botões, bordas ativas, links |
| `--fm-brand-hover` | `#14532D` (green-900) | Hover de botões e links |
| `--fm-brand-subtle` | `rgba(22,101,52,0.08)` | Fundo de tints brand |
| `--fm-brand-ring` | `rgba(22,101,52,0.2)` | Focus ring de inputs |

> **Contraste**: `#166534` com texto branco = 6.5:1 ✓ (WCAG AA e AAA).

### Quasar `$primary`

`$primary: #166534` — usado pelo Quasar em botões (`color="primary"`), progress, etc.

### Sidebar Verde Escuro (diferencial food SaaS)

| Token | Valor | Uso |
|---|---|---|
| `--fm-sidebar-bg` | `#14532D` (green-900) | Fundo da sidebar — verde floresta |
| `--fm-sidebar-text` | `#A7F3D0` (emerald-200) | Texto inativo na sidebar |
| `--fm-sidebar-hover` | `rgba(255,255,255,0.07)` | Hover de item inativo |
| `--fm-sidebar-active-bg` | `rgba(134,239,172,0.12)` | Fundo do item ativo |
| `--fm-sidebar-active-border` | `#86EFAC` (green-300) | Borda esquerda do item ativo |
| `--fm-sidebar-active-text` | `#FFFFFF` | Texto do item ativo |

### Warm Neutrals — Stone Scale

| Token | Valor | Uso |
|---|---|---|
| `--fm-content-bg` | `#FAFAF9` (stone-50) | Fundo da área de conteúdo |
| `--fm-surface` | `#FFFFFF` | Fundo de cards e modais |
| `--fm-border` | `#E7E5E4` (stone-200) | Bordas de cards e inputs |
| `--fm-border-strong` | `#D6D3D1` (stone-300) | Bordas em hover de cards |
| `--fm-text-primary` | `#1C1917` (stone-950) | Texto principal |
| `--fm-text-secondary` | `#78716C` (stone-500) | Texto auxiliar, subtítulos |
| `--fm-text-tertiary` | `#A8A29E` (stone-400) | Placeholders, labels de seção |

### Semânticos

| Token | Valor | Uso |
|---|---|---|
| `--fm-success` | `#15803D` (green-700) | Badge "Ativo", confirmações |
| `--fm-success-bg` | `#F0FDF4` | Fundo de badge ativo |
| `--fm-success-border` | `#BBF7D0` | Borda de badge ativo |
| `--fm-danger` | `#DC2626` (red-600) | Delete, erros, esgotado |
| `--fm-danger-bg` | `#FEF2F2` | Fundo de badge esgotado |
| `--fm-danger-border` | `#FECACA` | Borda de badge esgotado |
| `--fm-warning` | `#D97706` (amber-600) | Alertas, avisos |

### Sombras

```css
--fm-shadow-xs: 0 1px 2px rgba(0,0,0,0.05)          /* uso padrão em cards */
--fm-shadow-sm: 0 1px 3px rgba(0,0,0,0.08), ...      /* hover de cards */
--fm-shadow-md: 0 4px 6px rgba(0,0,0,0.06), ...      /* dropdowns, popovers */
--fm-shadow-lg: 0 10px 15px rgba(0,0,0,0.07), ...    /* modais, drawers */
```

---

## Tipografia

Fonte: **Inter** (pesos 300, 400, 500, 600, 700, 800 — carregados via Google Fonts).

| Contexto | Size | Weight | Letter-spacing | Uso |
|---|---|---|---|---|
| Display | `clamp(2rem, 4vw, 3.5rem)` | 800 | `-0.04em` | Wordmark do auth |
| Page title | `clamp(1.25rem, 2vw, 1.625rem)` | 800 | `-0.03em` | `AppPageHeader` |
| Section heading | `1rem` | 700 | `-0.01em` | Subtítulos de seção |
| Body | `0.875rem` | 400 | `0` | Texto corrido |
| Small/caption | `0.75rem` | 400 | `0` | Metadata, datas |
| UI label | `0.6875rem` | 600 | `+0.08em` | Labels de seção na sidebar, labels de campo |

**Regra**: quanto maior o texto, mais tight (`letter-spacing` negativo). Labels de UI pequenas têm tracking positivo para compensar o peso.

**Classe utilitária**: `.fm-label` aplica o estilo de label completo.

---

## Border Radius

```css
--fm-radius-xs: 4px    /* separadores internos, chips muito pequenos */
--fm-radius-sm: 6px    /* badges, avatares, ícones em box */
--fm-radius:    8px    /* botões, inputs (padrão Quasar override) */
--fm-radius-md: 10px   /* campo outlined do Quasar */
--fm-radius-lg: 12px   /* cards, panels */
--fm-radius-xl: 16px   /* modais, sheets */
--fm-radius-2xl: 20px  /* painéis de destaque */
```

---

## Componentes Base (classes utilitárias em `app.scss`)

### `.fm-card`

Card padrão do sistema. Use para qualquer container de conteúdo.

```html
<div class="fm-card" style="padding: 20px">
  Conteúdo do card
</div>
```

Para cards clicáveis, adicione `.fm-card--interactive` para o hover de borda/sombra.

### `.fm-badge`

Pill de status. Combinações disponíveis:

```html
<span class="fm-badge fm-badge--success">Ativo</span>
<span class="fm-badge fm-badge--muted">Esgotado</span>
<span class="fm-badge fm-badge--danger">Indisponível</span>
<span class="fm-badge fm-badge--brand">Destaque</span>
```

### `.fm-label`

Label de seção ou campo. Substitui qualquer texto que seria `text-transform: uppercase` + small.

```html
<p class="fm-label">Categoria</p>
```

---

## Componentes Vue Existentes

### `AppPageHeader`

Cabeçalho de página admin. Usa tipografia 800/tight.

```vue
<AppPageHeader title="Categorias" subtitle="Organize o cardápio por seções">
  <template #actions>
    <q-btn color="primary" label="Nova categoria" unelevated no-caps />
  </template>
</AppPageHeader>
```

Props: `title` (required), `subtitle`, `compact` (Boolean).

### `AppEmptyState`

Estado vazio de listas. Usa ícones Lucide via mapeamento interno.

```vue
<AppEmptyState
  icon="folder_open"
  title="Nenhuma categoria ainda"
  description="Crie categorias para organizar seu cardápio."
  action-label="Criar categoria"
  @action="handleCreate"
/>
```

Ícones disponíveis: `inbox`, `folder_open`, `restaurant_menu`, `utensils`, `settings`, `image`, `qr_code`, `dashboard`, `add`.

### `AppActionBar`

Wrapper flex para barra de ações acima de listas.

```vue
<AppActionBar>
  <q-input v-model="search" outlined dense placeholder="Buscar..." />
  <q-btn color="primary" label="Novo item" unelevated no-caps />
</AppActionBar>
```

---

## Layout do Painel

```
┌──────────────────────────────────────────────────────────────┐
│ TOPBAR (52px, branco, border-bottom stone-200)               │
│ [hamburger mobile] [Flash·Menu]      [vitrine] [avatar] [→]  │
├────────────────┬─────────────────────────────────────────────┤
│ SIDEBAR 248px  │                                             │
│ green-900      │  CONTEÚDO (background: stone-50)           │
│                │  padding: 20px                              │
│ Flash·Menu     │                                             │
│ ─────────────  │  <AppPageHeader>                           │
│ CARDÁPIO       │  ...conteúdo da página...                  │
│ ○ Dashboard    │                                             │
│ ○ Categorias   │                                             │
│ ○ Itens        │                                             │
│ CONTA          │                                             │
│ ○ Configurações│                                             │
└────────────────┴─────────────────────────────────────────────┘
```

**Sidebar section labels**: "CARDÁPIO" e "CONTA" — `.fm-label` com padding-top.

**Topbar avatar**: `border-radius: 6px` (quadrado), fundo green-100 (`#DCFCE7`), texto verde brand (`--fm-brand`).

---

## Layout de Auth

Formulário centralizado, sem painel lateral. Card branco com borda sutil sobre fundo stone-50.

```
           background: #FAFAF9

    ┌─────────────────────────────┐
    │  FlashMenu                  │  ← wordmark centralizado
    │                             │
    │  Entrar                     │  ← 1.75rem/800/-0.03em
    │  Acesse o painel...         │
    │                             │
    │  [email input]              │
    │  [senha input]              │
    │  [Entrar]                   │
    │                             │
    │  Ainda não tem conta?       │
    │  Criar conta                │
    └─────────────────────────────┘
      max-width: 400px, padding: 40px 36px
      border: 1px solid stone-200, radius: 16px
```

**Wordmark**: "Flash" em `font-weight: 300` stone-400, "Menu" em `font-weight: 800` verde brand (`--fm-brand`) — contraste de peso cria personalidade sem precisar de logo.

---

## Ícones

**Usar EXCLUSIVAMENTE** `lucide-vue-next` em componentes e páginas.

```vue
import { LayoutDashboard, FolderOpen, ChefHat, Plus, Trash2, Pencil } from 'lucide-vue-next'
```

**Exceção**: Ícones dentro de `q-input` (`prepend`/`append`) usam Material Icons (`q-icon name="..."`) por limitação da API do Quasar.

Tamanhos padrão:
- Ícone de navegação (sidebar): `:size="16"`
- Ícone em botão: `:size="16"` com `margin-right: 6px`
- Empty state: `:size="48"`
- Topbar/small actions: `:size="18"`

---

## Responsividade

Breakpoints Quasar (use as classes utilitárias, não media queries manuais):
- `xs`: < 600px
- `sm`: 600px – 1023px
- `md`: 1024px – 1439px

Classes de visibilidade: `gt-sm` (mostra em md+), `lt-md` (mostra em xs/sm), `gt-xs` (mostra em sm+).

Regras:
- Sidebar: oculta no mobile (drawer via hamburger)
- Painel brand do auth: oculto no mobile (`gt-sm`)
- Cards em grid: `12 colunas → coluna única no xs`
- AppPageHeader no mobile: title + subtitle empilhados, actions embaixo
- Topbar mobile: hamburger + Flash·Menu + botão logout (sem nome do restaurante)

---

## Regras Invioláveis

1. **NUNCA** usar azul corporativo (`#2563EB` e similares) no admin
2. **NUNCA** usar Material Icons em novos componentes — apenas Lucide
3. **NUNCA** mencionar "FlashMenu" na vitrine pública (ver `CLAUDE.md`)
4. Verde brand pode ser usado em fundos de botão e texto — contraste 6.5:1 com branco
5. Cards: **SEMPRE** `border: 1px solid var(--fm-border)` + `box-shadow-xs` — não apenas shadow
6. Novos componentes: seguir naming BEM: `.componente__elemento--modificador`
7. Imports de ícones: sempre nomeados (`import { X } from 'lucide-vue-next'`), nunca wildcard

---

## Transições

```css
--fm-transition: 150ms cubic-bezier(0.4, 0, 0.2, 1)
```

Aplicar em: `background`, `color`, `border-color`, `box-shadow`, `opacity`.
**Não** animar: `height`, `width` (prefira `max-height` com overflow), `transform` em hover de cards.

---

## Checklist para novos componentes

- [ ] Usa tokens CSS (`var(--fm-*)`) — nunca hex hardcoded
- [ ] Usa `color="primary"` do Quasar (herda `$primary: #166534`)
- [ ] Ícones de Lucide, não Material Icons
- [ ] Border-radius via `var(--fm-radius-*)` ou valor fixo documentado aqui
- [ ] Responsivo: testado em 390px (iPhone) e 1280px (desktop)
- [ ] Verde brand em texto sobre branco: usar `--fm-brand` (#166534, contraste 6.5:1)
