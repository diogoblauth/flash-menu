<template>
  <button type="button" class="sf-item" :class="{ 'sf-item--inactive': !item.active }" @click="$emit('click')">
    <div class="sf-item__info">
      <div class="sf-item__name-row">
        <span class="sf-item__name">{{ item.name }}</span>
        <span v-if="!item.active" class="fm-badge fm-badge--muted">Esgotado</span>
      </div>
      <p v-if="item.description" class="sf-item__description">{{ item.description }}</p>
      <span class="sf-item__price">{{ formatBRL(item.price) }}</span>
    </div>
    <img
      v-if="item.photo"
      :src="item.photo"
      :alt="item.name"
      class="sf-item__photo"
      loading="lazy"
    />
  </button>
</template>

<script setup>
import { formatBRL } from 'src/util/currency'

defineProps({
  item: { type: Object, required: true },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.sf-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  border: 0;
  border-bottom: 1px solid var(--fm-border);
  background: var(--fm-surface);

  &:last-child {
    border-bottom: 0;
  }

  @media (hover: hover) {
    &:hover {
      background: var(--fm-content-bg);
    }
  }
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background var(--fm-transition);

  &:active {
    background: rgba(0, 0, 0, 0.03);
  }

  &:focus-visible {
    outline: 2px solid var(--sf-primary);
    outline-offset: -2px;
  }

  &--inactive {
    .sf-item__info {
      opacity: 0.5;
    }

    .sf-item__photo {
      opacity: 0.5;
      filter: grayscale(1);
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--fm-text-primary);
  }

  &__description {
    margin: 4px 0 0;
    font-size: 0.8125rem;
    color: var(--fm-text-secondary);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__price {
    display: inline-block;
    margin-top: 6px;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--sf-primary-text-safe);
  }

  &__photo {
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: var(--fm-radius-md);
    background: var(--fm-content-bg);
  }
}

@media (max-width: 359px) {
  .sf-item__photo {
    width: 80px;
    height: 80px;
  }
}
</style>
