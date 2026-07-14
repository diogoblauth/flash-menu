<template>
  <q-dialog
    ref="dialogRef"
    persistent
    :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    @hide="onDialogHide"
  >
    <q-card :class="$q.screen.lt.sm ? 'tour-card tour-card--sheet' : 'tour-card tour-card--desktop'">
      <!-- Handle (mobile) -->
      <div v-if="$q.screen.lt.sm" class="tour-pill" />

      <!-- Pular -->
      <q-btn
        flat
        round
        dense
        class="tour-skip"
        :aria-label="isLast ? 'Fechar' : 'Pular tutorial'"
        @click="finish"
      >
        <X :size="18" />
      </q-btn>

      <!-- Slides -->
      <div class="tour-stage">
        <transition :name="transitionName" mode="out-in">
          <div :key="step" class="tour-slide">
            <div class="tour-icon">
              <component :is="current.icon" :size="34" :stroke-width="1.75" />
            </div>
            <p class="tour-slide__title">{{ current.title }}</p>
            <p class="tour-slide__text">{{ current.text }}</p>
          </div>
        </transition>
      </div>

      <!-- Dots -->
      <div class="tour-dots">
        <button
          v-for="(s, i) in slides"
          :key="i"
          type="button"
          class="tour-dot"
          :class="{ 'tour-dot--active': i === step }"
          :aria-label="`Ir para o passo ${i + 1}`"
          @click="goTo(i)"
        />
      </div>

      <!-- Ações -->
      <div class="tour-actions">
        <q-btn
          flat
          no-caps
          class="tour-btn tour-btn--ghost"
          :label="step === 0 ? 'Pular' : 'Voltar'"
          @click="step === 0 ? finish() : prev()"
        />
        <q-btn
          unelevated
          no-caps
          color="primary"
          class="tour-btn"
          :label="isLast ? 'Começar' : 'Próximo'"
          @click="next"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { PartyPopper, FolderTree, Sandwich, Palette, QrCode, X } from 'lucide-vue-next'
import { useAuthStore } from 'src/stores/auth'
import { completeOnboarding } from 'src/api/restaurant'

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const authStore = useAuthStore()

const firstName = computed(() => authStore.restaurantName?.split(' ')[0] || '')

const slides = computed(() => [
  {
    icon: PartyPopper,
    title: firstName.value ? `Bem-vindo, ${firstName.value}!` : 'Bem-vindo ao FlashMenu!',
    text: 'Vamos deixar seu cardápio digital pronto em poucos minutos. Veja como funciona.',
  },
  {
    icon: FolderTree,
    title: 'Organize em categorias',
    text: 'Crie seções como Entradas, Pratos, Bebidas e Sobremesas para organizar seu cardápio. A ordem delas define como o cliente vê.',
  },
  {
    icon: Sandwich,
    title: 'Cadastre seus itens',
    text: 'Adicione cada prato com nome, preço e foto. Esgotou? Basta desativar o item — ele volta com um toque, sem recadastrar.',
  },
  {
    icon: Palette,
    title: 'Deixe com a sua cara',
    text: 'Suba seu logo, escolha a cor da marca e defina os horários. A vitrine é 100% do seu estabelecimento.',
  },
  {
    icon: QrCode,
    title: 'Compartilhe com um QR Code',
    text: 'Baixe seu QR code no painel, imprima e cole na mesa ou no balcão. O cliente escaneia e vê o cardápio na hora.',
  },
])

const step = ref(0)
const transitionName = ref('slide-next')

const current = computed(() => slides.value[step.value])
const isLast = computed(() => step.value === slides.value.length - 1)

function prev() {
  if (step.value === 0) return
  transitionName.value = 'slide-prev'
  step.value -= 1
}

function next() {
  if (isLast.value) {
    finish()
    return
  }
  transitionName.value = 'slide-next'
  step.value += 1
}

function goTo(i) {
  if (i === step.value) return
  transitionName.value = i > step.value ? 'slide-next' : 'slide-prev'
  step.value = i
}

async function finish() {
  // Best-effort: mesmo que a chamada falhe, não travamos o usuário.
  authStore.markOnboardingComplete()
  try {
    await completeOnboarding()
  } catch {
    // silencioso — a flag local já foi marcada; o /me revalida depois
  }
  onDialogOK()
}
</script>

<style scoped>
.tour-card {
  position: relative;
  background: var(--fm-surface);
  overflow: hidden;
}

.tour-card--desktop {
  width: 440px;
  max-width: 90vw;
  border-radius: var(--fm-radius-xl) !important;
  box-shadow: var(--fm-shadow-lg);
  padding: 32px 32px 24px;
}

.tour-card--sheet {
  width: 100%;
  border-radius: 20px 20px 0 0 !important;
  padding: 8px 20px calc(20px + env(safe-area-inset-bottom, 0px));
}

.tour-pill {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--fm-border-strong);
  margin: 4px auto 8px;
}

.tour-skip {
  position: absolute;
  top: 12px;
  right: 12px;
  color: var(--fm-text-tertiary);
  z-index: 1;
}

/* ── Slides ─────────────────────────────────────── */
.tour-stage {
  min-height: 232px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 16px;
}

.tour-slide {
  text-align: center;
}

.tour-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--fm-radius-xl);
  background: var(--fm-brand-subtle);
  color: var(--fm-brand);
}

.tour-slide__title {
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--fm-text-primary);
  margin: 0 0 10px;
}

.tour-slide__text {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--fm-text-secondary);
  max-width: 340px;
  margin: 0 auto;
}

/* ── Dots ───────────────────────────────────────── */
.tour-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0 20px;
}

.tour-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--fm-border-strong);
  cursor: pointer;
  transition: var(--fm-transition);
}

.tour-dot--active {
  width: 22px;
  background: var(--fm-brand);
}

/* ── Ações ──────────────────────────────────────── */
.tour-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tour-btn {
  flex: 1;
  height: 46px;
  border-radius: var(--fm-radius-lg) !important;
  font-size: 0.9375rem !important;
  font-weight: 600;
}

.tour-btn--ghost {
  color: var(--fm-text-secondary) !important;
}

/* ── Transições ─────────────────────────────────── */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
