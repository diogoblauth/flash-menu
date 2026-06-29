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
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})
</script>

<style scoped>
.app-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.app-page-header--compact {
  margin-bottom: 12px;
}

.app-page-header__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.app-page-header__title {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.625rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--fm-text-primary);
  line-height: 1.15;
}

.app-page-header__subtitle {
  margin: 0;
  color: var(--fm-text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.app-page-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
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
