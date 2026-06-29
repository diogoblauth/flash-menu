import { ZodError } from 'zod'

const isDev = process.env.NODE_ENV !== 'production'

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Dados inválidos',
      errors: error.flatten().fieldErrors,
    })
  }

  if (typeof error.httpStatus === 'number') {
    return res.status(error.httpStatus).json({ message: error.message })
  }

  if (isDev) {
    console.error(error)
    return res.status(500).json({ message: error.message, stack: error.stack })
  }

  return res.status(500).json({ message: 'Erro interno do servidor' })
}
