<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-layout flex flex-center">
        <div class="auth-layout__wrapper">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'FlashMenu'
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.auth-layout__wrapper {
  width: 100%;
  max-width: 420px;
  padding: 24px 16px;
}
</style>
