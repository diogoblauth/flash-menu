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
        <p class="sheet-title">{{ isEditing ? 'Editar categoria' : 'Nova categoria' }}</p>
        <q-form ref="formRef" @submit.prevent="handleSave">
          <q-input
            v-model="name"
            label="Nome da categoria"
            outlined
            dense
            autofocus
            maxlength="100"
            counter
            :rules="[val => (val && val.trim().length > 0) || 'Nome é obrigatório']"
            @keydown.esc="handleEsc"
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
          @click="handleSave"
        />
        <q-btn flat no-caps class="sheet-btn sheet-btn--cancel" label="Cancelar" @click="onDialogCancel" />
      </div>
    </q-card>

    <!-- Desktop: centered dialog -->
    <q-card v-else class="desktop-card">
      <q-card-section class="desktop-header">
        <p class="desktop-title">{{ isEditing ? 'Editar categoria' : 'Nova categoria' }}</p>
      </q-card-section>

      <q-separator />

      <q-card-section class="desktop-body">
        <q-form ref="formRef" @submit.prevent="handleSave">
          <q-input
            v-model="name"
            label="Nome da categoria"
            outlined
            dense
            autofocus
            maxlength="100"
            counter
            :rules="[val => (val && val.trim().length > 0) || 'Nome é obrigatório']"
            @keydown.esc="handleEsc"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="desktop-actions">
        <q-btn flat no-caps label="Cancelar" @click="onDialogCancel" />
        <q-btn unelevated no-caps color="primary" label="Salvar" :loading="loading" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { createCategory, updateCategory } from 'src/api/categories'
import { notifyError } from 'src/util/notify'

const props = defineProps({
  category: { type: Object, default: null },
})

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const formRef = ref(null)
const loading = ref(false)
const name = ref(props.category?.name ?? '')

const isEditing = computed(() => props.category !== null)

function handleEsc() {
  if (!name.value.trim()) onDialogCancel()
}

async function handleSave() {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    let result
    if (isEditing.value) {
      const res = await updateCategory(props.category.id, { name: name.value.trim() })
      result = res.data.category
    } else {
      const res = await createCategory({ name: name.value.trim() })
      result = res.data.category
    }
    onDialogOK(result)
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao salvar categoria')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Desktop ─────────────────────────────────────────── */
.desktop-card {
  width: 400px;
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
}

.desktop-actions {
  padding: 4px 20px 20px;
  gap: 8px;
}

/* ── Mobile bottom sheet ──────────────────────────────── */
.sheet-card {
  width: 100%;
  border-radius: 20px 20px 0 0 !important;
  padding: 0 0 env(safe-area-inset-bottom, 16px);
}

.sheet-pill {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--fm-border-strong);
  margin: 12px auto 0;
}

.sheet-body {
  padding: 20px 20px 8px;
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
