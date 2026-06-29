import { Notify } from 'quasar'

/**
 * Notificação de sucesso (canto inferior direito).
 * @param {string} message
 * @param {string} [caption]
 */
export function notifySuccess(message, caption) {
  Notify.create({
    message,
    caption,
    color: 'positive',
    textColor: 'white',
    icon: 'check_circle',
    position: 'bottom-right',
    timeout: 2600,
    classes: 'my-notify',
  })
}

/**
 * Notificação de erro (canto inferior direito).
 * @param {string} message
 * @param {string} [caption]
 */
export function notifyError(message, caption) {
  Notify.create({
    message,
    caption,
    color: 'negative',
    textColor: 'white',
    icon: 'report_problem',
    position: 'bottom-right',
    timeout: 3200,
    classes: 'my-notify',
  })
}
