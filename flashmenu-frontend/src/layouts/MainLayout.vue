<template>
  <q-layout view="lHh LpR fFf">

    <!-- Topbar -->
    <q-header class="main-header">
      <q-toolbar style="min-height: 52px">
        <q-btn class="lt-md" flat dense round aria-label="Menu" @click="toggleDrawer">
          <Menu :size="18" />
        </q-btn>

        <span class="main-header__brand lt-md">
          <span class="brand-flash">Flash</span><span class="brand-menu">Menu</span>
        </span>

        <q-space />

        <div class="main-header__right">
          <!-- Ver vitrine — ícone+texto no desktop, só ícone no mobile -->
          <a
            v-if="authStore.restaurantSlug"
            :href="`/${authStore.restaurantSlug}`"
            target="_blank"
            rel="noopener noreferrer"
            class="header-storefront-link"
            title="Ver vitrine pública"
          >
            <ExternalLink :size="14" />
            <span class="gt-sm">Ver vitrine</span>
          </a>

          <!-- Avatar com dropdown -->
          <q-btn flat dense round class="header-avatar-btn" :ripple="false">
            <div class="header-avatar" :title="authStore.restaurantName || 'Perfil'">
              {{ avatarInitial }}
            </div>
            <q-menu anchor="bottom right" self="top right" :offset="[0, 6]" class="avatar-menu">
              <!-- Cabeçalho do menu -->
              <div class="avatar-menu__header">
                <p class="avatar-menu__name">{{ authStore.restaurantName }}</p>
                <p class="avatar-menu__email">{{ authStore.restaurant?.email }}</p>
              </div>

              <q-separator />

              <!-- Ver vitrine no mobile (já aparece no header no desktop) -->
              <q-item
                v-if="authStore.restaurantSlug"
                :href="`/${authStore.restaurantSlug}`"
                target="_blank"
                clickable
                class="lt-md avatar-menu__item"
              >
                <q-item-section avatar>
                  <ExternalLink :size="15" />
                </q-item-section>
                <q-item-section>Ver vitrine</q-item-section>
              </q-item>

              <q-item
                clickable
                class="avatar-menu__item"
                @click="router.push('/configuracoes')"
              >
                <q-item-section avatar>
                  <Settings :size="15" />
                </q-item-section>
                <q-item-section>Configurações</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable class="avatar-menu__item avatar-menu__item--danger" @click="handleLogout">
                <q-item-section avatar>
                  <LogOut :size="15" />
                </q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="248"
      :style="{ background: 'var(--fm-sidebar-bg)' }"
    >
      <div class="sidebar">

        <!-- Wordmark -->
        <div class="sidebar__brand">
          <UtensilsCrossed :size="15" class="sidebar__brand-icon" />
          <span class="sidebar__brand-text">
            <span class="brand-flash">Flash</span><span class="brand-menu">Menu</span>
          </span>
        </div>

        <!-- Navegação -->
        <nav class="sidebar__nav">
          <p class="sidebar__section-label">Cardápio</p>
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="sidebar__item"
            :class="{ 'sidebar__item--active': isActive(item.path) }"
          >
            <component :is="item.icon" :size="16" class="sidebar__item-icon" />
            <span>{{ item.label }}</span>
          </router-link>

          <p class="sidebar__section-label" style="margin-top: 8px">Conta</p>
          <router-link
            to="/configuracoes"
            class="sidebar__item"
            :class="{ 'sidebar__item--active': isActive('/configuracoes') }"
          >
            <Settings :size="16" class="sidebar__item-icon" />
            <span>Configurações</span>
          </router-link>
        </nav>

      </div>
    </q-drawer>

    <q-page-container class="main-content">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  UtensilsCrossed,
  LayoutDashboard,
  FolderOpen,
  ChefHat,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
} from 'lucide-vue-next'
import { useAuthStore } from 'src/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Categorias', path: '/categorias', icon: FolderOpen },
  { label: 'Itens', path: '/itens', icon: ChefHat },
]

const avatarInitial = computed(() => {
  const name = authStore.restaurantName
  return name ? name.charAt(0).toUpperCase() : '?'
})

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function isActive(path) {
  return route.path === path
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ── Topbar ─────────────────────────────────────────── */
.main-header {
  background: var(--fm-sidebar-bg); /* mesmo verde do sidebar — chrome unificado */
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
}

.main-header__brand {
  font-size: 1.125rem;
  letter-spacing: -0.03em;
  margin-left: 8px;
}

/* No mobile o brand fica no header — mesma lógica de cor do sidebar */
.brand-flash {
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
}

.brand-menu {
  font-weight: 800;
  color: #FFFFFF;
}

/* Botão hamburger e outros flat buttons no header escuro */
.main-header :deep(.q-btn) {
  color: rgba(255, 255, 255, 0.7);
}

.main-header :deep(.q-btn:hover) {
  color: #FFFFFF;
}

.main-header__right {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* ── Ver vitrine ────────────────────────────────────── */
.header-storefront-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: var(--fm-radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color var(--fm-transition), background var(--fm-transition);
}

.header-storefront-link:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.07);
}

/* ── Avatar e dropdown ──────────────────────────────── */
.header-avatar-btn {
  padding: 2px !important;
}

.header-avatar {
  width: 30px;
  height: 30px;
  border-radius: var(--fm-radius-sm);
  background: rgba(134, 239, 172, 0.2); /* green-300 com opacidade — pop sobre o fundo escuro */
  color: #86EFAC; /* green-300 — consistente com o acento do sidebar */
  border: 1px solid rgba(134, 239, 172, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
  cursor: pointer;
  transition: background var(--fm-transition), border-color var(--fm-transition);
}

.header-avatar:hover {
  background: rgba(134, 239, 172, 0.3);
  border-color: rgba(134, 239, 172, 0.5);
}
</style>

<style>
/* ── Avatar menu (sem scoped — q-menu é teletransportado para body) ── */
.avatar-menu {
  min-width: 200px;
  border-radius: var(--fm-radius-lg) !important;
  box-shadow: var(--fm-shadow-lg) !important;
  border: 1px solid var(--fm-border);
  overflow: hidden;
}

.avatar-menu__header {
  padding: 12px 16px 10px;
}

.avatar-menu__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fm-text-primary);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar-menu__email {
  font-size: 0.75rem;
  color: var(--fm-text-tertiary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar-menu__item {
  font-size: 0.875rem;
  color: var(--fm-text-primary);
  min-height: 40px;
  padding: 0 12px;
  gap: 4px;
}

.avatar-menu__item .q-item__section--avatar {
  min-width: 28px;
  color: var(--fm-text-secondary);
}

.avatar-menu__item--danger {
  color: var(--fm-danger) !important;
}

.avatar-menu__item--danger .q-item__section--avatar {
  color: var(--fm-danger) !important;
}
</style>

<style scoped>
/* ── Sidebar ─────────────────────────────────────────── */
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 10px 16px;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 6px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
}

.sidebar__brand-icon {
  color: #86EFAC; /* green-300 — único acento verde no brand */
  flex-shrink: 0;
}

.sidebar__brand-text {
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.sidebar__brand-text .brand-flash {
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5); /* era #4ADE80 — muito verde */
}

.sidebar__brand-text .brand-menu {
  font-weight: 800;
  color: #FFFFFF;
}

.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar__section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38); /* era #4ADE80 — labels agora são discretas */
  padding: 14px 8px 5px;
  margin: 0;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  height: 36px;
  border-radius: var(--fm-radius);
  color: var(--fm-sidebar-text);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-left: 2px solid transparent;
  transition:
    background var(--fm-transition),
    color var(--fm-transition),
    border-color var(--fm-transition);
}

.sidebar__item:hover {
  background: var(--fm-sidebar-hover);
  color: #FFFFFF;
}

.sidebar__item--active {
  background: var(--fm-sidebar-active-bg) !important;
  color: var(--fm-sidebar-active-text) !important;
  border-left-color: var(--fm-sidebar-active-border) !important;
}

.sidebar__item-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.sidebar__item--active .sidebar__item-icon {
  opacity: 1;
}

/* ── Área de conteúdo ─────────────────────────────────── */
.main-content {
  background: var(--fm-content-bg);
}
</style>
