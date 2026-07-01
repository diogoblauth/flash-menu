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

      <div class="sheet-icon-wrap">
        <div class="sheet-icon">
          <Trash2 :size="22" color="var(--fm-danger)" />
        </div>
      </div>

      <div class="sheet-body">
        <p class="sheet-title">Excluir item</p>
        <p class="sheet-message">
          Tem certeza que deseja excluir <strong>{{ itemName }}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </div>

      <div class="sheet-actions">
        <q-btn
          unelevated
          no-caps
          class="sheet-btn sheet-btn--danger"
          label="Excluir"
          @click="onDialogOK"
        />
        <q-btn flat no-caps class="sheet-btn sheet-btn--cancel" label="Cancelar" @click="onDialogCancel" />
      </div>
    </q-card>

    <!-- Desktop: centered dialog -->
    <q-card v-else class="desktop-card">
      <div class="desktop-icon-wrap">
        <div class="desktop-icon">
          <Trash2 :size="20" color="var(--fm-danger)" />
        </div>
      </div>

      <q-card-section class="desktop-body">
        <p class="desktop-title">Excluir item</p>
        <p class="desktop-message">
          Tem certeza que deseja excluir <strong>{{ itemName }}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </q-card-section>

      <q-card-actions align="right" class="desktop-actions">
        <q-btn flat no-caps label="Cancelar" @click="onDialogCancel" />
        <q-btn unelevated no-caps class="btn-danger" label="Excluir" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { Trash2 } from 'lucide-vue-next'

defineProps({
  itemName: { type: String, required: true },
})

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<style scoped>
/* ── Desktop ─────────────────────────────────────────── */
.desktop-card {
  width: 400px;
  border-radius: var(--fm-radius-xl) !important;
  overflow: hidden;
}

.desktop-icon-wrap {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.desktop-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.desktop-body {
  text-align: center;
  padding: 16px 24px 8px;
}

.desktop-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--fm-text-primary);
  margin: 0 0 8px;
}

.desktop-message {
  font-size: 0.875rem;
  color: var(--fm-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.desktop-actions {
  padding: 4px 20px 20px;
  gap: 8px;
}

.btn-danger {
  background-color: var(--fm-danger) !important;
  color: #fff !important;
  border-radius: var(--fm-radius) !important;
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

.sheet-icon-wrap {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.sheet-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sheet-body {
  padding: 16px 24px 8px;
  text-align: center;
}

.sheet-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--fm-text-primary);
  margin: 0 0 8px;
}

.sheet-message {
  font-size: 0.875rem;
  color: var(--fm-text-secondary);
  line-height: 1.55;
  margin: 0;
}

.sheet-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 20px 8px;
}

.sheet-btn {
  width: 100%;
  height: 48px;
  border-radius: var(--fm-radius-lg) !important;
  font-size: 0.9375rem !important;
}

.sheet-btn--danger {
  background-color: var(--fm-danger) !important;
  color: #fff !important;
}

.sheet-btn--cancel {
  color: var(--fm-text-secondary) !important;
}
</style>
