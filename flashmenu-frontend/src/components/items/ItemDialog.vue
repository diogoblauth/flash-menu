<template>
  <q-dialog
    ref="dialogRef"
    persistent
    :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    @hide="onDialogHide"
  >
    <!-- Mobile: bottom sheet -->
    <q-card v-if="$q.screen.lt.sm" class="sheet-card">
      <div class="sheet-pill" />

      <div class="sheet-body">
        <p class="sheet-title">{{ isEditing ? 'Editar item' : 'Novo item' }}</p>
        <q-form ref="formRef" @submit.prevent="handleSave">
          <q-input
            v-model="name"
            label="Nome do item"
            outlined
            dense
            autofocus
            maxlength="100"
            counter
            class="form-field"
            :rules="[val => (val && val.trim().length > 0) || 'Nome é obrigatório']"
          />
          <q-input
            v-model="description"
            label="Descrição (opcional)"
            type="textarea"
            autogrow
            outlined
            dense
            maxlength="500"
            counter
            class="form-field"
          />
          <q-input
            v-model.number="price"
            label="Preço"
            prefix="R$"
            type="number"
            step="0.01"
            min="0"
            outlined
            dense
            class="form-field"
            :rules="[val => (val !== null && val !== '' && Number(val) > 0) || 'Preço deve ser positivo']"
          />
          <AppImageUpload v-model="photo" class="form-field" @uploading="(val) => (photoUploading = val)" />
          <q-select
            v-model="categoryId"
            label="Categoria"
            outlined
            dense
            emit-value
            map-options
            :options="categoryOptions"
            class="form-field"
          />
          <q-toggle
            v-if="!isEditing"
            v-model="active"
            label="Disponível"
            color="primary"
            class="form-field"
          />
        </q-form>
      </div>

      <div class="sheet-actions">
        <q-btn
          unelevated
          no-caps
          color="primary"
          class="sheet-btn"
          label="Salvar"
          :loading="loading"
          :disable="photoUploading"
          @click="handleSave"
        />
        <q-btn flat no-caps class="sheet-btn sheet-btn--cancel" label="Cancelar" @click="onDialogCancel" />
      </div>
    </q-card>

    <!-- Desktop: centered dialog -->
    <q-card v-else class="desktop-card">
      <q-card-section class="desktop-header">
        <p class="desktop-title">{{ isEditing ? 'Editar item' : 'Novo item' }}</p>
      </q-card-section>

      <q-separator />

      <q-card-section class="desktop-body">
        <q-form ref="formRef" @submit.prevent="handleSave">
          <q-input
            v-model="name"
            label="Nome do item"
            outlined
            dense
            autofocus
            maxlength="100"
            counter
            class="form-field"
            :rules="[val => (val && val.trim().length > 0) || 'Nome é obrigatório']"
          />
          <q-input
            v-model="description"
            label="Descrição (opcional)"
            type="textarea"
            autogrow
            outlined
            dense
            maxlength="500"
            counter
            class="form-field"
          />
          <q-input
            v-model.number="price"
            label="Preço"
            prefix="R$"
            type="number"
            step="0.01"
            min="0"
            outlined
            dense
            class="form-field"
            :rules="[val => (val !== null && val !== '' && Number(val) > 0) || 'Preço deve ser positivo']"
          />
          <AppImageUpload v-model="photo" class="form-field" @uploading="(val) => (photoUploading = val)" />
          <q-select
            v-model="categoryId"
            label="Categoria"
            outlined
            dense
            emit-value
            map-options
            :options="categoryOptions"
            class="form-field"
          />
          <q-toggle
            v-if="!isEditing"
            v-model="active"
            label="Disponível"
            color="primary"
            class="form-field"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="desktop-actions">
        <q-btn flat no-caps label="Cancelar" @click="onDialogCancel" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Salvar"
          :loading="loading"
          :disable="photoUploading"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { createItem, updateItem } from 'src/api/items'
import { listCategories } from 'src/api/categories'
import { notifyError } from 'src/util/notify'
import AppImageUpload from 'src/components/ui/AppImageUpload.vue'

const props = defineProps({
  item: { type: Object, default: null },
})

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const formRef = ref(null)
const loading = ref(false)
const photoUploading = ref(false)

const name = ref(props.item?.name ?? '')
const description = ref(props.item?.description ?? '')
const price = ref(props.item ? Number(props.item.price) : null)
const photo = ref(props.item?.photo ?? null)
const categoryId = ref(props.item?.categoryId ?? null)
const active = ref(props.item?.active ?? true)

const categoryOptions = ref([{ label: 'Sem categoria', value: null }])

const isEditing = computed(() => props.item !== null)

async function loadCategories() {
  try {
    const res = await listCategories()
    categoryOptions.value = [
      { label: 'Sem categoria', value: null },
      ...res.data.categories.map((cat) => ({ label: cat.name, value: cat.id })),
    ]
  } catch {
    // mantém apenas "Sem categoria" caso a listagem falhe
  }
}

async function handleSave() {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const payload = {
      name: name.value.trim(),
      description: description.value?.trim() || undefined,
      price: Number(price.value),
      photo: photo.value ? photo.value.trim() : null,
      categoryId: categoryId.value,
    }

    let result
    if (isEditing.value) {
      const res = await updateItem(props.item.id, payload)
      result = res.data.item
    } else {
      const res = await createItem({ ...payload, active: active.value })
      result = res.data.item
    }
    onDialogOK(result)
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao salvar item')
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>

<style scoped>
/* ── Desktop ─────────────────────────────────────────── */
.desktop-card {
  width: 480px;
  max-width: 92vw;
  border-radius: var(--fm-radius-xl) !important;
  overflow: hidden;
}

.desktop-header {
  padding: 20px 24px 16px;
}

.desktop-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--fm-text-primary);
  margin: 0;
}

.desktop-body {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.desktop-actions {
  padding: 4px 20px 20px;
  gap: 8px;
}

.form-field + .form-field {
  margin-top: 14px;
}

/* ── Mobile bottom sheet ──────────────────────────────── */
.sheet-card {
  width: 100%;
  border-radius: 20px 20px 0 0 !important;
  padding: 0 0 env(safe-area-inset-bottom, 16px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.sheet-pill {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--fm-border-strong);
  margin: 12px auto 0;
  flex-shrink: 0;
}

.sheet-body {
  padding: 20px 20px 8px;
  overflow-y: auto;
}

.sheet-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--fm-text-primary);
  margin: 0 0 16px;
}

.sheet-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 8px;
  flex-shrink: 0;
}

.sheet-btn {
  width: 100%;
  height: 48px;
  border-radius: var(--fm-radius-lg) !important;
  font-size: 0.9375rem !important;
}

.sheet-btn--cancel {
  color: var(--fm-text-secondary) !important;
}
</style>
