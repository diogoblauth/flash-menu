<template>
  <q-page padding>
    <AppPageHeader title="Categorias" subtitle="Organize o cardápio por seções" />
    <AppEmptyState
      icon="folder_open"
      title="Em breve"
      description="O gerenciamento de categorias será implementado aqui."
    />
  </q-page>
</template>

<script setup>
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'

document.title = 'Categorias — FlashMenu'
</script>
