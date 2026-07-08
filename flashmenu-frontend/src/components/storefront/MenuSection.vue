<template>
  <section class="sf-section" :data-section-id="section.id" :aria-label="section.name">
    <div class="sf-section__heading">
      <h2 class="sf-section__title">{{ section.name }}</h2>
      <span class="sf-section__count">{{ section.items.length }} {{ section.items.length === 1 ? 'item' : 'itens' }}</span>
    </div>
    <div class="sf-section__card">
      <MenuItemRow
        v-for="item in section.items"
        :key="item.id"
        :item="item"
        @click="$emit('item-click', item)"
      />
    </div>
  </section>
</template>

<script setup>
import MenuItemRow from './MenuItemRow.vue'

defineProps({
  section: { type: Object, required: true },
})

defineEmits(['item-click'])
</script>

<style lang="scss" scoped>
.sf-section {
  scroll-margin-top: 68px;
  padding: 20px 16px 0;

  &:last-of-type {
    padding-bottom: 40px;
  }

  &__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 0 2px 10px;
  }

  &__title {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  &__count {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--fm-text-tertiary);
    white-space: nowrap;
  }

  &__card {
    background: var(--fm-surface);
    border: 1px solid var(--fm-border);
    border-radius: var(--fm-radius-xl);
    box-shadow: var(--fm-shadow-xs);
    overflow: hidden;
  }
}
</style>
