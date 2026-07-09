<template>
  <header class="sf-header">
    <!-- Hero: banner do estabelecimento ou canvas escuro com brilho da cor da marca -->
    <div class="sf-header__hero" :class="{ 'sf-header__hero--canvas': !restaurant.banner }">
      <img
        v-if="restaurant.banner"
        :src="restaurant.banner"
        :alt="`Banner de ${restaurant.name}`"
        class="sf-header__hero-img"
      />
      <div v-if="restaurant.banner" class="sf-header__hero-overlay" />
    </div>

    <div class="sf-header__card">
      <div class="sf-header__identity">
        <img
          v-if="restaurant.logo"
          :src="restaurant.logo"
          :alt="`Logo de ${restaurant.name}`"
          class="sf-header__logo"
        />
        <div v-else class="sf-header__logo sf-header__logo--placeholder">
          <Store :size="28" />
        </div>

        <div class="sf-header__titles">
          <h1 class="sf-header__name">{{ restaurant.name }}</h1>
          <div v-if="status" class="sf-header__status" :class="status.open ? 'sf-header__status--open' : 'sf-header__status--closed'">
            <span class="sf-header__status-dot" />
            {{ statusLabel }}
          </div>
        </div>
      </div>

      <p v-if="restaurant.description" class="sf-header__description">{{ restaurant.description }}</p>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Store } from 'lucide-vue-next'
import { formatOpenStatus } from 'src/util/openingHours'

const props = defineProps({
  restaurant: { type: Object, required: true },
  status: { type: Object, default: null },
})

const statusLabel = computed(() => formatOpenStatus(props.status))
</script>

<style lang="scss" scoped>
.sf-header {
  &__hero {
    position: relative;
    width: 100%;
    aspect-ratio: 5 / 2;
    max-height: 220px;
    overflow: hidden;

    // Sem banner: canvas na própria cor da marca, em variação tonal
    // (mais clara no topo, mais profunda na base) + grão sutil.
    &--canvas {
      aspect-ratio: auto;
      height: 168px;
      background:
        radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.12) 1px, transparent 1.5px),
        radial-gradient(80% 140% at 100% 0%, color-mix(in srgb, var(--sf-primary) 65%, #fff) 0%, transparent 60%),
        linear-gradient(150deg, color-mix(in srgb, var(--sf-primary) 78%, #fff) 0%, var(--sf-primary) 45%, color-mix(in srgb, var(--sf-primary) 52%, #000) 100%);
      background-size: 22px 22px, auto, auto;
    }
  }

  &__hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 45%, rgba(20, 17, 15, 0.45) 100%);
    pointer-events: none;
  }

  &__card {
    position: relative;
    margin: -44px 16px 0;
    padding: 16px;
    background: var(--fm-surface);
    border: 1px solid var(--fm-border);
    border-radius: var(--fm-radius-xl);
    box-shadow: var(--fm-shadow-md);
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__logo {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: var(--fm-radius-lg);
    border: 1px solid var(--fm-border);
    background: var(--fm-surface);

    &--placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--fm-text-tertiary);
      background: var(--fm-content-bg);
    }
  }

  &__titles {
    min-width: 0;
  }

  &__name {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    overflow-wrap: break-word;
  }

  &__description {
    margin: 12px 0 0;
    padding-top: 12px;
    border-top: 1px solid var(--fm-border);
    font-size: 0.875rem;
    color: var(--fm-text-secondary);
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__status {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid transparent;

    &--open {
      background: var(--fm-success-bg);
      color: var(--fm-success);
      border-color: var(--fm-success-border);
    }

    &--closed {
      background: var(--fm-content-bg);
      color: var(--fm-text-secondary);
      border-color: var(--fm-border);
    }
  }

  &__status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
}
</style>
