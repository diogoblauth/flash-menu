<template>
  <q-page padding>
    <AppPageHeader title="Dashboard" subtitle="Visão geral do seu restaurante" />

    <AppEmptyState
      icon="restaurant_menu"
      title="Tudo pronto para começar"
      description="Esta é a base do painel. As telas de cardápio, categorias, itens e QR code serão construídas a partir daqui."
    />
  </q-page>
</template>

<script setup>
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'

document.title = 'FlashMenu'
</script>
