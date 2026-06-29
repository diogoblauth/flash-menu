<template>
  <q-page padding>
    <AppPageHeader title="Configurações" subtitle="Perfil e aparência do seu restaurante" />
    <AppEmptyState
      icon="settings"
      title="Em breve"
      description="As configurações do restaurante e personalização da vitrine serão implementadas aqui."
    />
  </q-page>
</template>

<script setup>
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'

document.title = 'Configurações — FlashMenu'
</script>
