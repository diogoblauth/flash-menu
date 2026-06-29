import { verifyToken } from '../core/auth/jwt.js'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não encontrado' })
  }

  try {
    req.decoded = verifyToken(authHeader.slice(7))
    next()
  } catch (error) {
    next(error)
  }
}
