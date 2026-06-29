import bcrypt from 'bcrypt'
import { restaurantRepository } from '../repositories/restaurant.js'
import { createToken } from '../core/auth/jwt.js'
import { UnauthorizedError, ConflictError, NotFoundError } from '../core/errors/http-errors.js'

export async function loginService({ email, password }) {
  const restaurant = await restaurantRepository.findByEmail(email)

  // Resposta genérica: não revela se o e-mail existe no sistema
  if (!restaurant) throw new UnauthorizedError('E-mail ou senha incorretos')

  const valid = await bcrypt.compare(password, restaurant.password)
  if (!valid) throw new UnauthorizedError('E-mail ou senha incorretos')

  const token = createToken({ restaurantId: restaurant.id })
  const { password: _, ...safe } = restaurant
  return { token, restaurant: safe }
}

export async function registerService({ name, email, password }) {
  const existing = await restaurantRepository.findByEmail(email)
  if (existing) throw new ConflictError('Já existe uma conta com este e-mail')

  const slug = await generateSlug(name)
  const hashedPassword = await bcrypt.hash(password, 12)

  const restaurant = await restaurantRepository.create({ name, slug, email, password: hashedPassword })
  const token = createToken({ restaurantId: restaurant.id })

  const { password: _, ...safe } = restaurant
  return { token, restaurant: safe }
}

export async function getMeService(restaurantId) {
  const restaurant = await restaurantRepository.findById(restaurantId)
  if (!restaurant) throw new NotFoundError('Restaurante não encontrado')
  return restaurant
}

async function generateSlug(name) {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos corretamente
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
