<template>
  <q-page padding>
    <AppPageHeader title="Itens" subtitle="Gerencie os pratos e bebidas do cardápio" />
    <AppEmptyState
      icon="restaurant_menu"
      title="Em breve"
      description="O gerenciamento de itens será implementado aqui."
    />
  </q-page>
</template>

<script setup>
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'

document.title = 'Itens — FlashMenu'
</script>
