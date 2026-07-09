<template>
  <q-dialog :model-value="modelValue" position="bottom" @update:model-value="$emit('update:modelValue', $event)">
    <div v-if="item" class="sf-detail">
      <div class="sf-detail__media" :class="{ 'sf-detail__media--placeholder': !item.photo }">
        <img v-if="item.photo" :src="item.photo" :alt="item.name" class="sf-detail__photo" />
        <UtensilsCrossed v-else :size="48" class="sf-detail__placeholder-icon" />
        <button type="button" class="sf-detail__close" aria-label="Fechar" @click="$emit('update:modelValue', false)">
          <X :size="18" />
        </button>
      </div>

      <div class="sf-detail__body">
        <div class="sf-detail__name-row">
          <h3 class="sf-detail__name">{{ item.name }}</h3>
          <span v-if="!item.active" class="fm-badge fm-badge--muted">Esgotado</span>
        </div>
        <p v-if="item.description" class="sf-detail__description">{{ item.description }}</p>
        <div class="sf-detail__price">{{ formatBRL(item.price) }}</div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { X, UtensilsCrossed } from 'lucide-vue-next'
import { formatBRL } from 'src/util/currency'

defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.sf-detail {
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--fm-surface);
  border-radius: 20px 20px 0 0;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));

  &__media {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border-radius: 20px 20px 0 0;
    background: var(--fm-content-bg);

    &--placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__placeholder-icon {
    color: var(--fm-border-strong);
  }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.92);
    color: var(--fm-text-primary);
    cursor: pointer;
    box-shadow: var(--fm-shadow-sm);

    &:focus-visible {
      outline: 2px solid var(--sf-primary, var(--fm-text-primary));
      outline-offset: 2px;
    }
  }

  &__body {
    padding: 16px 20px 0;
  }

  &__name-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__name {
    margin: 0;
    font-size: 1.1875rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }

  &__description {
    margin: 8px 0 0;
    font-size: 0.875rem;
    color: var(--fm-text-secondary);
    line-height: 1.55;
    white-space: pre-line;
  }

  &__price {
    margin-top: 14px;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--sf-primary-text-safe, var(--fm-text-primary));
  }
}
</style>
