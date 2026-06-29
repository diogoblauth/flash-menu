import bcrypt from 'bcrypt'
import { restaurantRepository } from '../repositories/restaurant.js'
import { createToken } from '../core/auth/jwt.js'
import { ConflictError } from '../core/errors/http-errors.js'


async function generateSlug(name) {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  let slug = base
  let suffix = 2

  while (await restaurantRepository.findBySlug(slug)) {
    slug = `${base}-${suffix}`
    suffix++
  }

  return slug
}

/**
 * Cadastra um novo restaurante e retorna token + dados (sem password).
 * @param {{ name: string, email: string, password: string }} data
 */
export async function cadastroService({ name, email, password }) {
  const existing = await restaurantRepository.findByEmail(email)
  if (existing) throw new ConflictError('Já existe uma conta com este e-mail')

  const slug = await generateSlug(name)
  const hashedPassword = await bcrypt.hash(password, 12)

  const restaurant = await restaurantRepository.create({ name, slug, email, password: hashedPassword })

  const token = createToken({ restaurantId: restaurant.id })

  const { password: _, ...safe } = restaurant
  return { token, restaurant: safe }
}
