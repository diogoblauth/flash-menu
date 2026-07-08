import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import 'dayjs/locale/pt-br.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('pt-br')

export const APP_TIME_ZONE = 'America/Sao_Paulo'

/**
 * Data/hora atual no fuso do aplicativo.
 * @returns {import('dayjs').Dayjs}
 */
export function now() {
  return dayjs().tz(APP_TIME_ZONE)
}

/**
 * Formata uma data para exibição (padrão DD/MM/YYYY).
 * @param {string|number|Date} value
 * @param {string} [format='DD/MM/YYYY']
 * @returns {string}
 */
export function formatDate(value, format = 'DD/MM/YYYY') {
  if (!value) return ''
  return dayjs(value).tz(APP_TIME_ZONE).format(format)
}

export { dayjs }
