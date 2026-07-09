const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * Valida uma cor hexadecimal (#abc ou #aabbcc).
 * @param {string} hex
 * @returns {boolean}
 */
export function isValidHex(hex) {
  return typeof hex === 'string' && HEX_RE.test(hex)
}

/**
 * Luminância relativa (WCAG) de uma cor hexadecimal. Retorna null se inválida.
 * @param {string} hex
 * @returns {number|null}
 */
export function relativeLuminance(hex) {
  if (!isValidHex(hex)) return null
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Cor de texto legível sobre um fundo da cor informada.
 * @param {string} hex
 * @returns {string} branco ou stone-900
 */
export function onColor(hex) {
  const luminance = relativeLuminance(hex)
  return luminance === null || luminance < 0.45 ? '#FFFFFF' : '#1C1917'
}
