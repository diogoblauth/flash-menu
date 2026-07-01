<template>
  <div class="app-image-upload">
    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden-input"
      @change="onInputChange"
    />

    <div
      v-if="!previewUrl"
      class="dropzone"
      :class="{ 'dropzone--dragging': dragging }"
      @click="openPicker"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <div class="dropzone-icon">
        <ImagePlus :size="20" color="var(--fm-brand)" />
      </div>
      <p class="dropzone-text">Clique ou arraste uma imagem</p>
      <p class="dropzone-hint">JPEG, PNG ou WebP · até 2MB</p>
    </div>

    <div v-else class="preview" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="onDrop">
      <img :src="previewUrl" alt="Foto do item" class="preview-image" />

      <div v-if="uploading" class="preview-overlay">
        <q-spinner color="white" size="28px" />
      </div>

      <template v-else>
        <button type="button" class="preview-remove" @click.stop="removeImage">
          <X :size="14" color="#fff" />
        </button>
        <div class="preview-change" @click="openPicker">
          <ImagePlus :size="16" color="#fff" />
          <span>Trocar imagem</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import { useQuasar } from 'quasar'
import { ImagePlus, X } from 'lucide-vue-next'
import { uploadImage } from 'src/api/uploads'
import { notifyError } from 'src/util/notify'
import AppImageCropDialog from 'src/components/ui/AppImageCropDialog.vue'

const $q = useQuasar()

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const props = defineProps({
  modelValue: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue', 'uploading'])

const inputRef = ref(null)
const dragging = ref(false)
const uploading = ref(false)
const previewUrl = ref(props.modelValue)
let localBlobUrl = null

watch(
  () => props.modelValue,
  (val) => {
    if (!uploading.value) previewUrl.value = val
  },
)

watch(uploading, (val) => emit('uploading', val))

function openPicker() {
  inputRef.value?.click()
}

function onInputChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (file) handleFile(file)
}

function onDrop(event) {
  dragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function validateSize(file) {
  if (file.size > MAX_SIZE) {
    notifyError('A imagem deve ter no máximo 2MB')
    return false
  }
  return true
}

function handleFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    notifyError('Formato de imagem não suportado. Use JPEG, PNG ou WebP')
    return
  }
  if (!validateSize(file)) return

  const cropSrc = URL.createObjectURL(file)
  $q.dialog({
    component: AppImageCropDialog,
    componentProps: { imageSrc: cropSrc, mimeType: file.type, fileName: file.name },
  })
    .onOk((croppedFile) => {
      uploadFile(croppedFile)
    })
    .onDismiss(() => {
      URL.revokeObjectURL(cropSrc)
    })
}

async function uploadFile(file) {
  if (!validateSize(file)) return

  const previousUrl = props.modelValue
  revokeLocalBlob()
  localBlobUrl = URL.createObjectURL(file)
  previewUrl.value = localBlobUrl
  uploading.value = true

  try {
    const res = await uploadImage(file)
    emit('update:modelValue', res.data.url)
    previewUrl.value = res.data.url
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao enviar imagem')
    previewUrl.value = previousUrl
  } finally {
    revokeLocalBlob()
    uploading.value = false
  }
}

function removeImage() {
  previewUrl.value = null
  emit('update:modelValue', null)
}

function revokeLocalBlob() {
  if (localBlobUrl) {
    URL.revokeObjectURL(localBlobUrl)
    localBlobUrl = null
  }
}

onBeforeUnmount(revokeLocalBlob)
</script>

<style scoped>
.app-image-upload {
  width: 100%;
}

.hidden-input {
  display: none;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 128px;
  border: 1.5px dashed var(--fm-border-strong);
  border-radius: var(--fm-radius-lg);
  background: var(--fm-content-bg);
  cursor: pointer;
  transition: border-color var(--fm-transition), background var(--fm-transition), box-shadow var(--fm-transition);
}

.dropzone:hover,
.dropzone--dragging {
  border-color: var(--fm-brand);
  background: var(--fm-brand-subtle);
  box-shadow: var(--fm-shadow-xs);
}

.dropzone-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--fm-brand-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  transition: transform var(--fm-transition);
}

.dropzone:hover .dropzone-icon,
.dropzone--dragging .dropzone-icon {
  transform: scale(1.06);
}

.dropzone-text {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--fm-text-secondary);
}

.dropzone-hint {
  margin: 0;
  font-size: 0.75rem;
  color: var(--fm-text-tertiary);
}

.preview {
  position: relative;
  height: 120px;
  border-radius: var(--fm-radius-lg);
  overflow: hidden;
  border: 1px solid var(--fm-border);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--fm-transition);
}

.preview-remove:hover {
  background: var(--fm-danger);
}

.preview-change {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  opacity: 0.85;
  transition: opacity var(--fm-transition);
}

.preview:hover .preview-change {
  opacity: 1;
}
</style>
