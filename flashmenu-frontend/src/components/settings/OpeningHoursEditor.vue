<template>
  <div class="hours-editor">
    <div v-for="day in days" :key="day.key" class="hours-row">
      <div class="hours-row__head">
        <span class="hours-row__day">{{ day.label }}</span>
        <q-toggle
          v-model="day.open"
          color="primary"
          :label="day.open ? 'Aberto' : 'Fechado'"
          class="hours-row__toggle"
          @update:model-value="emitValue"
        />
      </div>

      <div v-if="day.open" class="hours-row__times">
        <q-input
          v-model="day.from"
          type="time"
          outlined
          dense
          class="hours-row__time"
          :error="hasError(day)"
          hide-bottom-space
          @update:model-value="emitValue"
        />
        <span class="hours-row__sep">às</span>
        <q-input
          v-model="day.to"
          type="time"
          outlined
          dense
          class="hours-row__time"
          :error="hasError(day)"
          hide-bottom-space
          @update:model-value="emitValue"
        />
      </div>
      <span v-else class="hours-row__closed">Fechado</span>

      <p v-if="hasError(day)" class="hours-row__error">
        O horário de abertura deve ser anterior ao de fechamento.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

// Ordem e rótulos fixos dos dias da semana.
const DAY_DEFS = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
]

// Padrão comum BR quando não há horário salvo: Seg–Sex aberto 09:00–18:00, fim de semana fechado.
const WEEKEND = ['sab', 'dom']

function buildDays(value) {
  return DAY_DEFS.map((def) => {
    const entry = value?.[def.key]
    if (entry) {
      return {
        ...def,
        open: !entry.closed,
        from: entry.open ?? '09:00',
        to: entry.close ?? '18:00',
      }
    }
    return {
      ...def,
      open: value ? false : !WEEKEND.includes(def.key),
      from: '09:00',
      to: '18:00',
    }
  })
}

const days = ref(buildDays(props.modelValue))

// Sincroniza quando o pai carrega os dados (ex: após o GET inicial).
watch(
  () => props.modelValue,
  (val) => {
    days.value = buildDays(val)
  },
)

function hasError(day) {
  return day.open && Boolean(day.from) && Boolean(day.to) && day.from >= day.to
}

function toPayload() {
  const result = {}
  for (const day of days.value) {
    result[day.key] = day.open
      ? { closed: false, open: day.from, close: day.to }
      : { closed: true }
  }
  return result
}

function emitValue() {
  emit('update:modelValue', toPayload())
}
</script>

<style scoped>
.hours-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hours-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 10px 0;
  border-bottom: 1px solid var(--fm-border);
}

.hours-row:last-child {
  border-bottom: none;
}

.hours-row__head {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.hours-row__day {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fm-text-primary);
  min-width: 72px;
}

.hours-row__toggle {
  font-size: 0.8125rem;
}

.hours-row__times {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hours-row__time {
  width: 120px;
}

.hours-row__sep {
  font-size: 0.8125rem;
  color: var(--fm-text-secondary);
}

.hours-row__closed {
  font-size: 0.8125rem;
  color: var(--fm-text-tertiary);
}

.hours-row__error {
  flex-basis: 100%;
  margin: 0;
  font-size: 0.75rem;
  color: var(--fm-danger);
}

@media (max-width: 599px) {
  .hours-row__head {
    width: 100%;
    justify-content: space-between;
    min-width: 0;
  }

  .hours-row__times {
    width: 100%;
  }

  .hours-row__time {
    flex: 1;
    width: auto;
  }
}
</style>
