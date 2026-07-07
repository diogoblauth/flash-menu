/**
 * Normaliza um texto em slug: minúsculas, sem acentos, espaços viram hífens
 * e caracteres inválidos são removidos. Não garante unicidade.
 * @param {string} value
 */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
