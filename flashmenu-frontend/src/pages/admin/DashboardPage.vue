<template>
  <q-page padding>
    <AppPageHeader title="Dashboard" subtitle="Visão geral do seu restaurante" />

    <AppEmptyState
      icon="restaurant_menu"
      title="Tudo pronto para começar"
      description="Crie suas categorias e itens de cardápio. Em breve você verá o resumo do seu cardápio e o QR code aqui."
    />
  </q-page>
</template>

<script setup>
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'

document.title = 'FlashMenu'
</script>
