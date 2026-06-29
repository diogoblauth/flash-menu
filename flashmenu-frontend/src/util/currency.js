const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/**
 * Formata um valor numérico como moeda brasileira (R$).
 * @param {number} value
 * @returns {string}
 */
export function formatBRL(value) {
  const number = Number(value)
  return BRL_FORMATTER.format(Number.isFinite(number) ? number : 0)
}
