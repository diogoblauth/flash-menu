<template>
  <q-dialog ref="dialogRef" :maximized="$q.screen.lt.sm" persistent @hide="onDialogHide">
    <q-card class="crop-card" :class="{ 'crop-card--mobile': isMobile }">
      <div class="crop-header">
        <!-- Mobile: X à esquerda para cancelar (padrão de app bar) -->
        <q-btn v-if="isMobile" flat round dense class="crop-close crop-close--left" @click="onDialogCancel">
          <X :size="20" color="var(--fm-text-secondary)" />
        </q-btn>

        <div class="crop-header-info">
          <div v-if="!isMobile" class="crop-icon">
            <Crop :size="18" color="var(--fm-brand)" />
          </div>
          <div class="min-w-0">
            <p class="crop-title">Ajustar imagem</p>
            <p v-if="!isMobile" class="crop-subtitle">
              Posicione o quadro sobre a área que deve aparecer no cardápio
            </p>
          </div>
        </div>

        <!-- Mobile: confirmar no topo, onde a barra do navegador nunca cobre -->
        <q-btn
          v-if="isMobile"
          unelevated
          no-caps
          dense
          color="primary"
          class="crop-confirm-top"
          label="Confirmar"
          @click="handleConfirm"
        />
        <!-- Desktop: X à direita -->
        <q-btn v-else flat round dense class="crop-close" @click="onDialogCancel">
          <X :size="18" color="var(--fm-text-secondary)" />
        </q-btn>
      </div>

      <q-separator />

      <div class="cropper-wrap" :style="wrapStyle">
        <Cropper
          ref="cropperRef"
          class="cropper"
          :src="imageSrc"
          :stencil-component="round ? CircleStencil : RectangleStencil"
          :stencil-props="round ? {} : { aspectRatio }"
          image-restriction="stencil"
        />

        <q-btn round unelevated size="sm" class="reset-btn" @click="handleReset">
          <RotateCcw :size="15" color="var(--fm-text-primary)" />
          <q-tooltip>Redefinir</q-tooltip>
        </q-btn>
      </div>

      <q-card-actions v-if="!isMobile" align="right" class="crop-actions">
        <q-btn flat no-caps label="Cancelar" @click="onDialogCancel" />
        <q-btn unelevated no-caps color="primary" label="Cortar e continuar" @click="handleConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { Cropper, RectangleStencil, CircleStencil } from 'vue-advanced-cropper'
import { X, Crop, RotateCcw } from 'lucide-vue-next'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps({
  imageSrc: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileName: { type: String, required: true },
  aspectRatio: { type: Number, default: 1 },
  round: { type: Boolean, default: false },
})

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const cropperRef = ref(null)
const naturalAspectRatio = ref(1)

const isMobile = computed(() => $q.screen.lt.sm)

// Ajusta a altura do editor à proporção real da imagem, evitando faixas vazias
const wrapStyle = computed(() => {
  if ($q.screen.lt.sm) return {}
  const upper = props.round ? 1.8 : Math.max(1.8, props.aspectRatio)
  const clamped = Math.min(Math.max(naturalAspectRatio.value, 0.6), upper)
  return { aspectRatio: String(clamped), height: 'auto', maxHeight: '65vh' }
})

onMounted(() => {
  const img = new Image()
  img.onload = () => {
    if (img.naturalWidth && img.naturalHeight) {
      naturalAspectRatio.value = img.naturalWidth / img.naturalHeight
    }
  }
  img.src = props.imageSrc
})

function handleReset() {
  cropperRef.value?.reset()
}

function handleConfirm() {
  const result = cropperRef.value?.getResult()
  if (!result?.canvas) return onDialogCancel()

  const outputType = props.mimeType === 'image/png' ? 'image/png' : 'image/jpeg'
  result.canvas.toBlob(
    (blob) => {
      if (!blob) return onDialogCancel()
      onDialogOK(new File([blob], props.fileName, { type: blob.type }))
    },
    outputType,
    0.9,
  )
}
</script>

<style scoped>
.crop-card {
  width: 560px;
  max-width: 92vw;
  border-radius: var(--fm-radius-xl) !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--fm-shadow-lg);
}

.crop-card--mobile {
  width: 100%;
  max-width: 100%;
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  border-radius: 0 !important;
}

.crop-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 12px 18px 20px;
  flex-shrink: 0;
}

.crop-header-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.crop-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--fm-radius-md);
  background: var(--fm-brand-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.crop-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--fm-text-primary);
  margin: 0;
  line-height: 1.3;
}

.crop-subtitle {
  font-size: 0.75rem;
  color: var(--fm-text-secondary);
  margin: 3px 0 0;
  line-height: 1.4;
}

.crop-close {
  flex-shrink: 0;
}

.min-w-0 {
  min-width: 0;
}

/* ── App bar mobile: X | título centralizado | Cortar ── */
.crop-card--mobile .crop-header {
  align-items: center;
  padding: 10px 12px;
  gap: 8px;
}

.crop-card--mobile .crop-header-info {
  flex: 1;
  justify-content: center;
  text-align: center;
}

.crop-card--mobile .crop-title {
  font-size: 1rem;
}

.crop-close--left {
  flex-shrink: 0;
}

.crop-confirm-top {
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  border-radius: var(--fm-radius-md);
  font-weight: 700;
}

.cropper-wrap {
  position: relative;
  height: 360px;
  background: var(--fm-content-bg);
  flex-shrink: 0;
}

.crop-card--mobile .cropper-wrap {
  flex: 1 1 0;
  height: auto;
  /* Permite que a área do cropper encolha abaixo da altura natural da imagem
     (padrão min-height:auto de item flex). Sem isto, fotos compridas empurram
     o rodapé para fora do card e os botões somem sob a barra do navegador. */
  min-height: 0;
}

.cropper {
  width: 100%;
  height: 100%;
}

.reset-btn {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: var(--fm-shadow-sm);
}

.crop-actions {
  padding: 16px 20px 20px;
  gap: 8px;
  flex-shrink: 0;
  padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
}

/* ── Acentua os controles do cropper com a cor de marca ── */
.cropper-wrap :deep(.vue-advanced-cropper__background) {
  background: var(--fm-content-bg);
}

.cropper-wrap :deep(.vue-simple-line) {
  border-color: rgba(255, 255, 255, 0.85);
}

.cropper-wrap :deep(.vue-simple-handler) {
  background: var(--fm-brand);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9);
}

.cropper-wrap :deep(.vue-rectangle-stencil__preview) {
  box-shadow: 0 0 0 2px var(--fm-brand);
}
</style>

<!-- Estilo global (não scoped): o QDialog é teleportado para o body, fora do
     escopo deste componente. No modo maximizado o Quasar força o card a
     `height:100%` com especificidade maior que a nossa classe — isso resolvia
     para a altura do viewport "grande" (incluindo a área atrás da barra do
     Safari/Chrome), escondendo o rodapé. Aqui vencemos a especificidade e
     usamos dvh para respeitar a área realmente visível. -->
<style>
.q-dialog__inner--maximized > .crop-card--mobile {
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
}
</style>
