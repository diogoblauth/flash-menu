import { api } from 'src/boot/axios'

export async function login({ email, password }) {
  const response = await api.post('/api/v1/auth/login', { email, password })
  return response.data
}

export async function register({ name, email, password }) {
  const response = await api.post('/api/v1/auth/register', { name, email, password })
  return response.data
}

// Valida o token atual e retorna dados frescos do restaurante.
// Usado no boot para verificar sessões persistidas no localStorage.
export async function getMe() {
  const response = await api.get('/api/v1/auth/me')
  return response.data
}
