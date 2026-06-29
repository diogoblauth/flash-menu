<template>
  <div class="app-empty-state">
    <component :is="resolvedIcon" :size="48" class="app-empty-state__icon" />
    <div class="app-empty-state__title">{{ title }}</div>
    <div v-if="description" class="app-empty-state__description">{{ description }}</div>
    <q-btn
      v-if="actionLabel"
      color="primary"
      :label="actionLabel"
      unelevated
      no-caps
      class="app-empty-state__btn"
      @click="$emit('action')"
    >
      <template v-if="ActionIconComponent" #prepend>
        <component :is="ActionIconComponent" :size="16" style="margin-right: 6px" />
      </template>
    </q-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Inbox,
  FolderOpen,
  ChefHat,
  Utensils,
  Settings,
  Image,
  QrCode,
  LayoutDashboard,
  Plus,
} from 'lucide-vue-next'

const lucideMap = {
  inbox: Inbox,
  folder_open: FolderOpen,
  restaurant_menu: ChefHat,
  utensils: Utensils,
  settings: Settings,
  image: Image,
  qr_code: QrCode,
  dashboard: LayoutDashboard,
  add: Plus,
}

const props = defineProps({
  icon: { type: String, default: 'inbox' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  actionIcon: { type: String, default: '' },
})

defineEmits(['action'])

const resolvedIcon = computed(() => lucideMap[props.icon] ?? Inbox)
const ActionIconComponent = computed(() => (props.actionIcon ? (lucideMap[props.actionIcon] ?? null) : null))
</script>

<style scoped>
.app-empty-state {
  text-align: center;
  padding: 56px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-empty-state__icon {
  color: var(--fm-border-strong);
}

.app-empty-state__title {
  margin-top: 16px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fm-text-primary);
}

.app-empty-state__description {
  margin-top: 6px;
  font-size: 0.875rem;
  color: var(--fm-text-secondary);
  max-width: 380px;
  line-height: 1.5;
}

.app-empty-state__btn {
  margin-top: 20px;
  height: 40px;
  font-size: 0.875rem;
}
</style>
