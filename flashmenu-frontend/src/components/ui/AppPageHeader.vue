<template>
  <div class="app-page-header" :class="{ 'app-page-header--compact': compact }">
    <div class="app-page-header__content">
      <h1 class="app-page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="app-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions || $slots.default" class="app-page-header__actions">
      <slot name="actions" />
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.app-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.app-page-header--compact {
  margin-bottom: 6px;
}

.app-page-header__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-page-header__title {
  margin: 0;
  font-size: clamp(1.05rem, 1.4vw + 0.85rem, 1.35rem);
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.app-page-header__subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.88rem;
  line-height: 1.35;
}

.app-page-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 599px) {
  .app-page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .app-page-header__actions {
    justify-content: flex-end;
  }
}
</style>
