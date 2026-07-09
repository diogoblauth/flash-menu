import { now } from './date.js'

// Índice = dayjs day() (0 = domingo)
const DAY_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
const DAY_LABELS = {
  dom: 'domingo',
  seg: 'segunda',
  ter: 'terça',
  qua: 'quarta',
  qui: 'quinta',
  sex: 'sexta',
  sab: 'sábado',
}

function hhmmToMin(hhmm) {
  if (typeof hhmm !== 'string' || !/^\d{2}:\d{2}$/.test(hhmm)) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function dayRange(day) {
  if (!day || day.closed) return null
  const open = hhmmToMin(day.open)
  const close = hhmmToMin(day.close)
  if (open === null || close === null) return null
  return { open, close }
}

/**
 * Status de funcionamento a partir do horário atual (fuso do app).
 * Suporta faixas overnight (ex: 18:00–02:00).
 * @param {object|null} openingHours — { seg: { closed, open, close }, ..., dom: {...} }
 * @returns {{ open: boolean, closesAt?: string, opensAt?: string, opensDayLabel?: string }|null}
 *          null quando não há horários configurados.
 */
export function getOpenStatus(openingHours) {
  if (!openingHours || typeof openingHours !== 'object') return null
  const hasAny = DAY_KEYS.some((key) => dayRange(openingHours[key]))
  if (!hasAny) return null

  const current = now()
  const nowMin = current.hour() * 60 + current.minute()
  const todayKey = DAY_KEYS[current.day()]
  const yesterdayKey = DAY_KEYS[(current.day() + 6) % 7]

  // Faixa de ontem que atravessa a meia-noite (ex: 18:00–02:00)
  const yesterday = dayRange(openingHours[yesterdayKey])
  if (yesterday && yesterday.close < yesterday.open && nowMin < yesterday.close) {
    return { open: true, closesAt: openingHours[yesterdayKey].close }
  }

  const today = dayRange(openingHours[todayKey])
  if (today) {
    const overnight = today.close < today.open
    const isOpen = overnight ? nowMin >= today.open : nowMin >= today.open && nowMin < today.close
    if (isOpen) return { open: true, closesAt: openingHours[todayKey].close }
    if (nowMin < today.open) return { open: false, opensAt: openingHours[todayKey].open }
  }

  // Próximo dia com horário configurado
  for (let offset = 1; offset <= 7; offset++) {
    const key = DAY_KEYS[(current.day() + offset) % 7]
    const range = dayRange(openingHours[key])
    if (range) {
      return { open: false, opensAt: openingHours[key].open, opensDayLabel: DAY_LABELS[key] }
    }
  }
  return { open: false }
}

/**
 * Texto de exibição do status (ex: "Aberto agora · Fecha às 18:00").
 * @param {ReturnType<typeof getOpenStatus>} status
 * @returns {string}
 */
export function formatOpenStatus(status) {
  if (!status) return ''
  if (status.open) {
    return status.closesAt ? `Aberto agora · Fecha às ${status.closesAt}` : 'Aberto agora'
  }
  if (status.opensAt && status.opensDayLabel) return `Fechado · Abre ${status.opensDayLabel} às ${status.opensAt}`
  if (status.opensAt) return `Fechado · Abre às ${status.opensAt}`
  return 'Fechado no momento'
}
