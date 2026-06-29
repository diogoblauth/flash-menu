<template>
  <div class="app-action-bar">
    <slot />
  </div>
</template>

<script setup>
//
</script>

<style scoped>
.app-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

@media (max-width: 599px) {
  .app-action-bar {
    flex-wrap: wrap;
  }
}
</style>
