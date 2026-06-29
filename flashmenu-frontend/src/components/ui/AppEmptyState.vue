<template>
  <div class="app-empty-state">
    <q-icon :name="icon" :size="iconSize" color="grey-5" />
    <div class="app-empty-state__title">{{ title }}</div>
    <div v-if="description" class="app-empty-state__description">{{ description }}</div>
    <q-btn
      v-if="actionLabel"
      color="primary"
      :label="actionLabel"
      :icon="actionIcon"
      unelevated
      no-caps
      class="app-empty-state__btn"
      @click="$emit('action')"
    />
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'inbox',
  },
  iconSize: {
    type: String,
    default: '72px',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: String,
    default: '',
  },
})

defineEmits(['action'])
</script>

<style scoped>
.app-empty-state {
  text-align: center;
  padding: 48px 20px;
}

.app-empty-state__title {
  margin-top: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  color: #4b5563;
}

.app-empty-state__description {
  margin-top: 6px;
  color: #6b7280;
}

.app-empty-state__btn {
  margin-top: 16px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  height: 44px;
}
</style>
