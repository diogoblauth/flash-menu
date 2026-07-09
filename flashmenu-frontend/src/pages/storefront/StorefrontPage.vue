<template>
  <q-page class="sf-page" :style="themeVars">
    <div class="sf-page__container">
      <!-- Loading -->
      <div v-if="state === 'loading'" class="sf-skeleton">
        <q-skeleton type="rect" class="sf-skeleton__banner" square />
        <div class="sf-skeleton__head">
          <q-skeleton type="rect" width="72px" height="72px" style="border-radius: 16px" />
          <q-skeleton type="text" width="60%" height="28px" />
          <q-skeleton type="text" width="85%" />
        </div>
        <div class="sf-skeleton__pills">
          <q-skeleton v-for="n in 3" :key="n" type="QChip" width="88px" />
        </div>
        <div v-for="n in 4" :key="'row' + n" class="sf-skeleton__row">
          <div class="sf-skeleton__row-text">
            <q-skeleton type="text" width="55%" />
            <q-skeleton type="text" width="90%" />
            <q-skeleton type="text" width="30%" />
          </div>
          <q-skeleton type="rect" width="96px" height="96px" style="border-radius: 10px" />
        </div>
      </div>

      <!-- 404 -->
      <StorefrontNotFound v-else-if="state === 'notFound'" />

      <!-- Erro de rede -->
      <div v-else-if="state === 'error'" class="sf-error">
        <WifiOff :size="48" class="sf-error__icon" />
        <div class="sf-error__title">Não foi possível carregar o cardápio</div>
        <div class="sf-error__description">Verifique sua conexão e tente novamente.</div>
        <q-btn unelevated no-caps label="Tentar novamente" class="sf-error__btn" @click="fetchMenu" />
      </div>

      <!-- Cardápio -->
      <div v-else-if="state === 'ready'" class="sf-page__fade">
        <StorefrontHeader :restaurant="restaurant" :status="openStatus" />

        <template v-if="sections.length">
          <CategoryPills :sections="sections" :active-id="activeSectionId" @select="scrollToSection" />
          <MenuSection
            v-for="section in sections"
            :key="section.id"
            :ref="(el) => registerSection(section.id, el)"
            :section="section"
            @item-click="openItem"
          />
        </template>

        <div v-else class="sf-empty">
          <ClipboardList :size="48" class="sf-empty__icon" />
          <div class="sf-empty__title">Cardápio em construção</div>
          <div class="sf-empty__description">Este estabelecimento ainda não publicou seus itens. Volte em breve!</div>
        </div>

        <ItemDetailDialog v-model="detailOpen" :item="selectedItem" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ClipboardList, WifiOff } from 'lucide-vue-next'
import { getPublicMenu } from 'src/api/public'
import { isValidHex, relativeLuminance, onColor } from 'src/util/color'
import { getOpenStatus } from 'src/util/openingHours'
import StorefrontHeader from 'src/components/storefront/StorefrontHeader.vue'
import CategoryPills from 'src/components/storefront/CategoryPills.vue'
import MenuSection from 'src/components/storefront/MenuSection.vue'
import ItemDetailDialog from 'src/components/storefront/ItemDetailDialog.vue'
import StorefrontNotFound from 'src/components/storefront/StorefrontNotFound.vue'

const route = useRoute()

const state = ref('loading') // loading | notFound | error | ready
const restaurant = ref(null)
const sections = ref([])
const openStatus = ref(null)
const activeSectionId = ref(null)
const detailOpen = ref(false)
const selectedItem = ref(null)

// ─── Tema por restaurante ────────────────────────────────────────────────────
const FALLBACK_PRIMARY = '#1C1917'

const themeVars = computed(() => {
  const raw = restaurant.value?.primaryColor
  const primary = isValidHex(raw) ? raw : FALLBACK_PRIMARY
  const luminance = relativeLuminance(primary) ?? 0
  return {
    '--sf-primary': primary,
    '--sf-on-primary': onColor(primary),
    // Cor clara demais não funciona como texto sobre fundo claro
    '--sf-primary-text-safe': luminance > 0.6 ? 'var(--fm-text-primary)' : primary,
  }
})

// ─── Fetch ───────────────────────────────────────────────────────────────────
async function fetchMenu() {
  state.value = 'loading'
  try {
    const data = await getPublicMenu(route.params.slug)
    restaurant.value = data.restaurant

    const groups = data.categories
      .filter((category) => category.items.length > 0)
      .map((category) => ({ id: category.id, name: category.name, items: category.items }))
    if (data.uncategorizedItems.length > 0) {
      groups.push({ id: 'outros', name: 'Outros', items: data.uncategorizedItems })
    }
    sections.value = groups
    activeSectionId.value = groups[0]?.id ?? null

    openStatus.value = getOpenStatus(data.restaurant.openingHours)
    document.title = data.restaurant.name
    state.value = 'ready'
    nextTick(setupScrollSpy)
  } catch (error) {
    if (error?.response?.status === 404) {
      document.title = 'Página não encontrada'
      state.value = 'notFound'
    } else {
      state.value = 'error'
    }
  }
}

// ─── Detalhe do item ─────────────────────────────────────────────────────────
function openItem(item) {
  selectedItem.value = item
  detailOpen.value = true
}

// ─── Scroll-spy + navegação por pill ─────────────────────────────────────────
const sectionEls = new Map()
let observer = null
let suppressSpy = false
let suppressTimer = null

function registerSection(id, componentInstance) {
  const el = componentInstance?.$el
  if (el) sectionEls.set(id, el)
}

function setupScrollSpy() {
  observer?.disconnect()
  if (!sections.value.length || typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      if (suppressSpy) return
      const visible = entries.filter((e) => e.isIntersecting)
      if (!visible.length) return
      const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
      const id = topmost.target.dataset.sectionId
      activeSectionId.value = id === 'outros' ? 'outros' : Number(id)
    },
    { rootMargin: '-64px 0px -70% 0px' },
  )
  sectionEls.forEach((el) => observer.observe(el))
}

function scrollToSection(id) {
  const el = sectionEls.get(id)
  if (!el) return
  activeSectionId.value = id
  suppressSpy = true
  clearTimeout(suppressTimer)
  suppressTimer = setTimeout(() => {
    suppressSpy = false
  }, 700)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

// ─── Status "aberto agora" atualizado a cada minuto ──────────────────────────
let statusInterval = null

onMounted(() => {
  fetchMenu()
  statusInterval = setInterval(() => {
    if (restaurant.value) openStatus.value = getOpenStatus(restaurant.value.openingHours)
  }, 60000)
})

onUnmounted(() => {
  observer?.disconnect()
  clearInterval(statusInterval)
  clearTimeout(suppressTimer)
})
</script>

<style lang="scss" scoped>
// ─── Skeleton ────────────────────────────────────────────────────────────────
.sf-skeleton {
  &__banner {
    width: 100%;
    aspect-ratio: 3 / 1;
    height: auto;
  }

  &__head {
    padding: 0 16px;
    margin-top: -36px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__pills {
    display: flex;
    gap: 8px;
    padding: 16px;
  }

  &__row {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    border-top: 1px solid var(--fm-border);
  }

  &__row-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

// ─── Erro / vazio ────────────────────────────────────────────────────────────
.sf-error,
.sf-empty {
  text-align: center;
  padding: 72px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    color: var(--fm-border-strong);
  }

  &__title {
    margin-top: 16px;
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  &__description {
    margin-top: 6px;
    font-size: 0.875rem;
    color: var(--fm-text-secondary);
    max-width: 320px;
    line-height: 1.5;
  }
}

.sf-error__btn {
  margin-top: 20px;
  background: var(--sf-primary, var(--fm-text-primary));
  color: var(--sf-on-primary, #fff);
  height: 42px;
  padding: 0 24px;
  border-radius: 99px;
}
</style>
