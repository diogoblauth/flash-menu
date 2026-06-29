import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { LocalStorage } from 'quasar'
import routes from './routes.js'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to) => {
    const token = LocalStorage.getItem('token')
    const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth)
    const isPublicOnly = to.matched.some((r) => r.meta?.isPublicOnly)

    // Rota protegida sem token → login
    if (requiresAuth && !token) return '/login'

    // Páginas de auth com sessão ativa → dashboard (evita loop de login)
    if (isPublicOnly && token) return '/dashboard'
  })

  return Router
})
