<template>
  <nav class="sf-pills" aria-label="Categorias do cardápio">
    <div class="sf-pills__track">
      <button
        v-for="section in sections"
        :key="section.id"
        :ref="(el) => registerPill(section.id, el)"
        type="button"
        class="sf-pills__pill"
        :class="{ 'sf-pills__pill--active': section.id === activeId }"
        :aria-current="section.id === activeId ? 'true' : undefined"
        @click="$emit('select', section.id)"
      >
        {{ section.name }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  sections: { type: Array, required: true },
  activeId: { type: [Number, String], default: null },
})

defineEmits(['select'])

const pillEls = new Map()

function registerPill(id, el) {
  if (el) pillEls.set(id, el)
}

// Mantém a pill ativa visível na barra durante o scroll-spy
watch(
  () => props.activeId,
  (id) => {
    const el = pillEls.get(id)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  },
)
</script>

<style lang="scss" scoped>
.sf-pills {
  position: sticky;
  top: 0;
  margin-top: 16px;
  z-index: 10;
  background: color-mix(in srgb, var(--fm-content-bg) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--fm-border);

  &__track {
    display: flex;
    gap: 8px;
    padding: 10px 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__pill {
    flex-shrink: 0;
    padding: 7px 14px;
    border-radius: 99px;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.3;
    background: var(--fm-surface);
    color: var(--fm-text-secondary);
    border: 1px solid var(--fm-border);
    box-shadow: var(--fm-shadow-xs);
    cursor: pointer;
    transition: background var(--fm-transition), color var(--fm-transition), border-color var(--fm-transition);

    &:focus-visible {
      outline: 2px solid var(--sf-primary);
      outline-offset: 2px;
    }

    &--active {
      background: var(--sf-primary);
      color: var(--sf-on-primary);
      border-color: var(--sf-primary);
    }
  }
}
</style>
