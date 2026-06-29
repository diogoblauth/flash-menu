import bcrypt from 'bcrypt'
import { restaurantRepository } from '../repositories/restaurant.js'
import { createToken } from '../core/auth/jwt.js'
import { UnauthorizedError } from '../core/errors/http-errors.js'

/**
 * @param {{ email: string, password: string }} credentials
 */
export async function loginService({ email, password }) {
  const restaurant = await restaurantRepository.findByEmail(email)

  if (!restaurant) throw new UnauthorizedError('E-mail ou senha incorretos')

  const valid = await bcrypt.compare(password, restaurant.password)
  if (!valid) throw new UnauthorizedError('E-mail ou senha incorretos')

  const token = createToken({ restaurantId: restaurant.id })

  const { password: _, ...safe } = restaurant
  return { token, restaurant: safe }
}
