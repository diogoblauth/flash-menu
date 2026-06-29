<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-dark lt-md">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />
        <q-toolbar-title class="text-weight-bold">FlashMenu</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="260">
      <div class="column full-height">
        <div class="drawer-brand">
          <q-avatar rounded color="primary" text-color="white">
            <Zap :size="20" />
          </q-avatar>
          <span class="drawer-brand__name">FlashMenu</span>
        </div>

        <nav class="drawer-nav">
          <div
            v-for="item in navItems"
            :key="item.path"
            class="drawer-item"
            :class="{ 'drawer-item--active': isActive(item.path) }"
            @click="navigate(item.path)"
          >
            <component :is="item.icon" :size="18" class="drawer-item__icon" />
            <span>{{ item.label }}</span>
          </div>
        </nav>

        <div class="q-mt-auto">
          <div class="drawer-item drawer-item--logout" @click="handleLogout">
            <LogOut :size="18" class="drawer-item__icon" />
            <span>Sair</span>
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Zap, LogOut } from 'lucide-vue-next'
import { useAuthStore } from 'src/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const navItems = [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }]

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function isActive(path) {
  return route.path === path
}

function navigate(path) {
  if (route.path !== path) router.push(path)
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.drawer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
}

.drawer-brand__name {
  font-size: 1.15rem;
  font-weight: 700;
}

.drawer-nav {
  padding: 8px 12px;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #4b5563;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.15s ease;
}

.drawer-item:hover {
  background-color: #f3f4f6;
}

.drawer-item--active {
  background-color: var(--q-primary);
  color: #fff;
}

.drawer-item--logout {
  margin: 12px;
  color: #b91c1c;
}

.drawer-item--logout:hover {
  background-color: #fef2f2;
}
</style>
