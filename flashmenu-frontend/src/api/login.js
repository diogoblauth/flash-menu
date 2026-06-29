import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

/**
 * @typedef {Object} LoginResponse
 * @property {string} token   Token JWT do restaurante autenticado.
 * @property {Object} [restaurant] Dados básicos do restaurante (opcional).
 */

/**
 * Autentica o restaurante e persiste o token.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<LoginResponse>}
 */
export async function login({ email, password }) {
  const response = await api.post('/login', { email, password })

  const { token } = response.data
  if (token) {
    LocalStorage.setItem('token', token)
  }

  return response.data
}
