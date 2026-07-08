<template>
  <div class="sf-not-found">
    <Store :size="48" class="sf-not-found__icon" />
    <div class="sf-not-found__title">Cardápio não encontrado</div>
    <div class="sf-not-found__description">
      Verifique o endereço e tente novamente. O link pode ter sido alterado pelo estabelecimento.
    </div>
  </div>
</template>

<script setup>
import { Store } from 'lucide-vue-next'
</script>

<style lang="scss" scoped>
.sf-not-found {
  text-align: center;
  padding: 96px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    color: var(--fm-border-strong);
  }

  &__title {
    margin-top: 16px;
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  &__description {
    margin-top: 6px;
    font-size: 0.875rem;
    color: var(--fm-text-secondary);
    max-width: 320px;
    line-height: 1.5;
  }
}
</style>
