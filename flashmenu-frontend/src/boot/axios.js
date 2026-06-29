import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'

// Instância única do axios, reutilizada por toda a camada de API (src/api/*).
const api = axios.create({
  baseURL: process.env.API,
  timeout: 10000,
})

// Request interceptor: injeta o token de autenticação quando existir.
api.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: tratamento global de 401 — limpa o token e volta ao login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      LocalStorage.remove('token')
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
