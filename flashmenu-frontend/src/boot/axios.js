import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'

const api = axios.create({
  baseURL: process.env.API,
  timeout: 10000,
})

// Injeta o token em todas as requisições autenticadas
api.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// 401 → limpa sessão completa e redireciona para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      LocalStorage.remove('token')
      LocalStorage.remove('restaurant')
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default defineBoot(async ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  // Valida token persistido no localStorage ao carregar o app.
  // Se inválido/expirado, limpa a sessão antes de qualquer navegação.
  const token = LocalStorage.getItem('token')
  if (token) {
    try {
      const { getMe } = await import('src/api/auth')
      const { useAuthStore } = await import('src/stores/auth')
      const restaurant = await getMe()
      useAuthStore().setSession({ token, restaurant })
    } catch {
      LocalStorage.remove('token')
      LocalStorage.remove('restaurant')
    }
  }
})

export { api }
