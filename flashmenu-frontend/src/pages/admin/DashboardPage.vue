<template>
  <q-page padding>
    <AppPageHeader v-if="!dashboard" title="Dashboard" subtitle="Visão geral do seu restaurante" />

    <div v-else class="dashboard-greeting">
      <img
        v-if="dashboard.restaurant.logo"
        :src="dashboard.restaurant.logo"
        :alt="`Logo de ${dashboard.restaurant.name}`"
        class="dashboard-greeting__logo"
      />
      <div v-else class="dashboard-greeting__logo dashboard-greeting__logo--placeholder">
        <Store :size="20" />
      </div>
      <div class="dashboard-greeting__text">
        <h1 class="fm-page-title">Bem-vindo, {{ dashboard.restaurant.name }}</h1>
        <p class="dashboard-greeting__subtitle">Visão geral do seu restaurante</p>
      </div>
    </div>

    <div style="position: relative; min-height: 200px">
      <q-inner-loading :showing="loading">
        <q-spinner color="primary" size="40px" />
      </q-inner-loading>

      <AppEmptyState
        v-if="!loading && loadError"
        icon="dashboard"
        title="Não foi possível carregar"
        description="Ocorreu um erro ao buscar os dados do seu dashboard. Tente novamente."
        action-label="Tentar novamente"
        @action="fetchDashboard"
      />

      <AppEmptyState
        v-else-if="!loading && isEmpty"
        icon="restaurant_menu"
        title="Tudo pronto para começar"
        description="Crie suas categorias e itens de cardápio para ver o resumo do seu cardápio aqui."
        action-label="Criar categoria"
        action-icon="add"
        @action="router.push('/categorias')"
      />

      <div v-else-if="!loading && dashboard" class="dashboard">
        <div class="dashboard__stats">
          <StatTile :icon="Utensils" label="Total de itens" :value="dashboard.totalItems" />
          <StatTile
            :icon="CheckCircle2"
            label="Itens ativos"
            :value="dashboard.activeItems"
            tone="success"
          />
          <StatTile
            :icon="CircleOff"
            label="Itens inativos"
            :value="dashboard.inactiveItems"
            tone="muted"
          />
          <StatTile :icon="FolderOpen" label="Categorias" :value="dashboard.totalCategories" />
        </div>

        <div class="dashboard__grid">
          <section class="fm-card dashboard-card">
            <header class="settings__card-head">
              <LayoutList :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Itens por categoria</p>
            </header>

            <div v-if="dashboard.itemsByCategory.length === 0" class="category-bar__empty">
              Nenhuma categoria cadastrada ainda.
            </div>

            <div
              v-for="cat in dashboard.itemsByCategory"
              :key="cat.categoryId ?? 'none'"
              class="category-bar"
            >
              <div class="category-bar__row">
                <span class="category-bar__name" :class="{ 'category-bar__name--muted': !cat.categoryId }">
                  {{ cat.name }}
                </span>
                <span class="category-bar__count">{{ cat.itemCount }}</span>
              </div>
              <div class="category-bar__track">
                <div class="category-bar__fill" :style="{ width: categoryPct(cat.itemCount) + '%' }" />
              </div>
            </div>
          </section>

          <section class="fm-card dashboard-card">
            <header class="settings__card-head">
              <QrCode :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Vitrine pública</p>
            </header>

            <div class="storefront">
              <div class="storefront__url">{{ dashboard.restaurant.publicUrl }}</div>
              <div class="storefront__actions">
                <q-btn
                  type="button"
                  outline
                  no-caps
                  :color="copied ? 'positive' : 'primary'"
                  class="copy-btn"
                  @click="copyLink"
                >
                  <component
                    :is="copied ? Check : Copy"
                    :size="15"
                    class="q-mr-xs"
                    :class="{ 'copy-btn__icon--pop': copied }"
                  />
                  Copiar
                </q-btn>
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  type="a"
                  :href="`/${dashboard.restaurant.slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink :size="15" class="q-mr-xs" />
                  Ver vitrine
                </q-btn>
              </div>
            </div>

            <div class="qr-block">
              <div class="qr-block__image-wrap">
                <q-inner-loading :showing="qrLoading">
                  <q-spinner size="24px" color="primary" />
                </q-inner-loading>
                <img
                  v-if="qrImageUrl"
                  :src="qrImageUrl"
                  alt="QR code da vitrine"
                  class="qr-block__image"
                />
              </div>
              <q-btn
                unelevated
                no-caps
                color="primary"
                :loading="qrDownloading"
                @click="downloadQrCode"
              >
                <Download :size="15" class="q-mr-xs" />
                Baixar QR code
              </q-btn>
            </div>
          </section>
        </div>

        <section v-if="dashboard.priceStats" class="fm-card dashboard-card">
          <header class="settings__card-head">
            <CircleDollarSign :size="16" color="var(--fm-brand)" />
            <p class="fm-label settings__card-title">Preços do cardápio</p>
          </header>

          <div class="price-stats">
            <div class="price-stat">
              <div class="price-stat__icon price-stat__icon--success">
                <TrendingDown :size="18" />
              </div>
              <p class="fm-label">Mais barato</p>
              <p class="price-stat__value">{{ formatBRL(dashboard.priceStats.cheapest.price) }}</p>
              <p class="price-stat__name">{{ dashboard.priceStats.cheapest.name }}</p>
            </div>
            <div class="price-stat">
              <div class="price-stat__icon price-stat__icon--brand">
                <Wallet :size="18" />
              </div>
              <p class="fm-label">Ticket médio</p>
              <p class="price-stat__value">{{ formatBRL(dashboard.priceStats.average) }}</p>
              <p class="price-stat__name price-stat__name--placeholder">Média entre itens ativos</p>
            </div>
            <div class="price-stat">
              <div class="price-stat__icon price-stat__icon--warning">
                <TrendingUp :size="18" />
              </div>
              <p class="fm-label">Mais caro</p>
              <p class="price-stat__value">{{ formatBRL(dashboard.priceStats.priciest.price) }}</p>
              <p class="price-stat__name">{{ dashboard.priceStats.priciest.name }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import {
  Utensils,
  CheckCircle2,
  CircleOff,
  FolderOpen,
  LayoutList,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  Store,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-vue-next'
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'
import StatTile from 'src/components/dashboard/StatTile.vue'
import { getDashboard, getQrCode } from 'src/api/dashboard'
import { notifySuccess, notifyError } from 'src/util/notify'
import { formatBRL } from 'src/util/currency'
import { useAuthStore } from 'src/stores/auth'
import WelcomeTourDialog from 'src/components/onboarding/WelcomeTourDialog.vue'

document.title = 'Dashboard — FlashMenu'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

// Primeiro acesso: exibe o tutorial de boas-vindas uma única vez.
if (authStore.needsOnboarding) {
  $q.dialog({ component: WelcomeTourDialog })
}

const loading = ref(true)
const loadError = ref(false)
const dashboard = ref(null)

const qrImageUrl = ref('')
const qrLoading = ref(false)
const qrDownloading = ref(false)

const copied = ref(false)
let copiedTimeout = null
let qrObjectUrl = null

const isEmpty = computed(() => dashboard.value?.totalItems === 0)

const maxCategoryCount = computed(() => {
  const counts = (dashboard.value?.itemsByCategory ?? []).map((c) => c.itemCount)
  return Math.max(1, ...counts)
})

function categoryPct(count) {
  return Math.round((count / maxCategoryCount.value) * 100)
}

async function fetchDashboard() {
  loading.value = true
  loadError.value = false
  try {
    const res = await getDashboard()
    dashboard.value = res.data.dashboard
  } catch (err) {
    loadError.value = true
    notifyError(err?.response?.data?.message ?? 'Erro ao carregar o dashboard')
  } finally {
    loading.value = false
  }
}

async function fetchQrPreview() {
  qrLoading.value = true
  try {
    const res = await getQrCode()
    qrObjectUrl = URL.createObjectURL(res.data)
    qrImageUrl.value = qrObjectUrl
  } catch {
    // Silencioso: o QR é complementar e não deve travar a página.
  } finally {
    qrLoading.value = false
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(dashboard.value.restaurant.publicUrl)
    copied.value = true
    clearTimeout(copiedTimeout)
    copiedTimeout = setTimeout(() => (copied.value = false), 1800)
    notifySuccess('Link copiado')
  } catch {
    notifyError('Não foi possível copiar o link')
  }
}

async function downloadQrCode() {
  qrDownloading.value = true
  try {
    const res = await getQrCode()
    const url = URL.createObjectURL(res.data)
    const link = document.createElement('a')
    link.href = url
    link.download = `qrcode-${dashboard.value.restaurant.slug}.png`
    link.click()
    URL.revokeObjectURL(url)
    notifySuccess('QR code baixado')
  } catch {
    notifyError('Não foi possível baixar o QR code')
  } finally {
    qrDownloading.value = false
  }
}

onUnmounted(() => {
  if (qrObjectUrl) URL.revokeObjectURL(qrObjectUrl)
})

fetchDashboard()
fetchQrPreview()
</script>

<style scoped>
.dashboard-greeting {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.dashboard-greeting__logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: var(--fm-radius-md);
  border: 1px solid var(--fm-border);
  background: var(--fm-surface);
}

.dashboard-greeting__logo--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fm-text-tertiary);
  background: var(--fm-content-bg);
}

.dashboard-greeting__text {
  min-width: 0;
}

.dashboard-greeting__subtitle {
  margin: 3px 0 0;
  color: var(--fm-text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 1024px) {
  .dashboard__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.dashboard-card {
  padding: 20px;
}

.settings__card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.settings__card-title {
  margin: 0;
}

/* Barras de itens por categoria */
.category-bar {
  margin-bottom: 14px;
}

.category-bar:last-child {
  margin-bottom: 0;
}

.category-bar__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.category-bar__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fm-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-bar__name--muted {
  color: var(--fm-text-tertiary);
  font-weight: 500;
  font-style: italic;
}

.category-bar__count {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--fm-text-secondary);
  flex-shrink: 0;
}

.category-bar__track {
  height: 6px;
  border-radius: var(--fm-radius-xs);
  background: var(--fm-content-bg);
  overflow: hidden;
}

.category-bar__fill {
  height: 100%;
  border-radius: var(--fm-radius-xs);
  background: var(--fm-brand);
  transition: width var(--fm-transition);
}

.category-bar__empty {
  font-size: 0.875rem;
  color: var(--fm-text-tertiary);
}

/* Preços do cardápio */
.price-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.price-stat {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 18px 12px;
  background: var(--fm-content-bg);
  border: 1px solid var(--fm-border);
  border-radius: var(--fm-radius-lg);
}

.price-stat__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.price-stat__icon--success {
  background: var(--fm-success-bg);
  color: var(--fm-success);
}

.price-stat__icon--brand {
  background: var(--fm-brand-subtle);
  color: var(--fm-brand);
}

.price-stat__icon--warning {
  background: rgba(217, 119, 6, 0.12);
  color: var(--fm-warning);
}

.price-stat__value {
  margin: 6px 0 2px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--fm-text-primary);
  line-height: 1.1;
}

.price-stat__name {
  margin: 0;
  max-width: 100%;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--fm-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-stat__name--placeholder {
  font-weight: 400;
  font-style: italic;
  color: var(--fm-text-tertiary);
}

@media (max-width: 480px) {
  .price-stats {
    grid-template-columns: 1fr;
  }
}

/* Vitrine pública — mesmo padrão visual de ProfilePage.vue */
.storefront {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.storefront__url {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fm-text-primary);
  word-break: break-all;
}

.storefront__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.copy-btn {
  transition: color var(--fm-transition), border-color var(--fm-transition);
}

.copy-btn__icon--pop {
  animation: copy-pop 0.3s ease;
}

@keyframes copy-pop {
  0% {
    transform: scale(0.6);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

/* QR code */
.qr-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid var(--fm-border);
}

.qr-block__image-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-block__image {
  width: 180px;
  height: 180px;
  border-radius: var(--fm-radius-md);
  border: 1px solid var(--fm-border);
}

@media (max-width: 599px) {
  .storefront__actions {
    width: 100%;
  }
}
</style>
