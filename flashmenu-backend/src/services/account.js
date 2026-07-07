import bcrypt from 'bcrypt'
import { restaurantRepository } from '../repositories/restaurant.js'
import { BadRequestError, NotFoundError } from '../core/errors/http-errors.js'

export async function changePasswordService(restaurantId, { currentPassword, newPassword }) {
  const restaurant = await restaurantRepository.findByIdWithPassword(restaurantId)
  if (!restaurant) throw new NotFoundError('Restaurante não encontrado')

  const valid = await bcrypt.compare(currentPassword, restaurant.password)
  // 400 (não 401): 401 dispararia o logout global no interceptor do axios do frontend
  if (!valid) throw new BadRequestError('Senha atual incorreta')

  const hashed = await bcrypt.hash(newPassword, 12)
  await restaurantRepository.updatePassword(restaurantId, hashed)
}
