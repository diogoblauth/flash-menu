<template>
  <div class="fm-card stat-tile">
    <component :is="icon" :size="18" :color="iconColor" />
    <p class="stat-tile__value">{{ value }}</p>
    <p class="fm-label">{{ label }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: [Object, Function], required: true },
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  tone: { type: String, default: 'default' },
})

const toneColors = {
  default: 'var(--fm-brand)',
  success: 'var(--fm-success)',
  muted: 'var(--fm-text-tertiary)',
}

const iconColor = computed(() => toneColors[props.tone] ?? toneColors.default)
</script>

<style scoped>
.stat-tile {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-tile__value {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--fm-text-primary);
  line-height: 1.1;
}
</style>
