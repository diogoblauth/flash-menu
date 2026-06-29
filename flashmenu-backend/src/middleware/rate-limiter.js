import { rateLimit } from 'express-rate-limit'

// Rate limiting só ativo em produção — em dev evita bloqueios durante teste manual.
// Para testar rate limiting localmente: NODE_ENV=production npm run dev
const skip = () => process.env.NODE_ENV !== 'production'

function jsonHandler(res, _req, options) {
  res.status(options.statusCode).json({ message: 'Muitas requisições, tente novamente mais tarde.' })
}

// Global: cobertura geral da API
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 1000,
  skip,
  handler: jsonHandler,
})

// Login: proteção contra força bruta — 10 tentativas / 15 min por IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skip,
  handler: jsonHandler,
})

// Register: previne criação em massa — 5 contas / hora por IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  skip,
  handler: jsonHandler,
})
