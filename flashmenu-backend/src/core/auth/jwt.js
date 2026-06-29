import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/http-errors.js'

const JWT_SECRET = process.env.JWT_SECRET

/**
 * @param {{ restaurantId: number }} payload
 * @returns {string}
 */
export function createToken({ restaurantId }) {
  return jwt.sign({ restaurantId }, JWT_SECRET, { expiresIn: '10h' })
}

/**
 * @param {string} token
 * @returns {{ restaurantId: number }}
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado')
  }
}
