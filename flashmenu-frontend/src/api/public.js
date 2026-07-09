import axios from 'axios'

// Instância própria: sem Authorization e sem o interceptor 401 → /login do admin.
// A vitrine é anônima — um erro aqui nunca deve redirecionar o visitante.
const publicApi = axios.create({
  baseURL: process.env.API,
  timeout: 10000,
})

/**
 * Cardápio público completo de um restaurante (uma única requisição).
 * @param {string} slug
 * @returns {Promise<{ restaurant: object, categories: Array, uncategorizedItems: Array }>}
 */
export async function getPublicMenu(slug) {
  const { data } = await publicApi.get(`/api/v1/public/${encodeURIComponent(slug)}`)
  return data
}
