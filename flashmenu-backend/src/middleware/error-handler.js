import { ZodError } from 'zod'
import multer from 'multer'

const isDev = process.env.NODE_ENV !== 'production'

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Dados inválidos',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === 'LIMIT_FILE_SIZE' ? 'Arquivo excede o limite de 4MB' : 'Erro no upload do arquivo'
    return res.status(400).json({ message })
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
