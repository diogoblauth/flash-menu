import { verifyToken } from '../core/auth/jwt.js'

export function authenticate(req, res, next) {
  const token = req.headers?.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' })
  }

  try {
    req.decoded = verifyToken(token)
    next()
  } catch (error) {
    next(error)
  }
}
