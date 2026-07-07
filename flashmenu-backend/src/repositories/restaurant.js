import { prisma } from '../database/prisma.js'

/**
 * @param {string} email
 */
async function findByEmail(email) {
  return prisma.restaurant.findUnique({ where: { email } })
}

/**
 * @param {string} slug
 */
async function findBySlug(slug) {
  return prisma.restaurant.findUnique({ where: { slug } })
}

/**
 * @param {number} id
 */
async function findById(id) {
  return prisma.restaurant.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, description: true, logo: true, banner: true, primaryColor: true, openingHours: true, email: true, createdAt: true },
  })
}

/**
 * Inclui o hash da senha — usar apenas em fluxos sensíveis (ex: troca de senha).
 * @param {number} id
 */
async function findByIdWithPassword(id) {
  return prisma.restaurant.findUnique({ where: { id } })
}

/**
 * @param {{ name: string, slug: string, email: string, password: string }} data
 */
async function create(data) {
  return prisma.restaurant.create({ data })
}

/**
 * @param {number} id
 * @param {Partial<{ name: string, slug: string, description: string, logo: string, banner: string, primaryColor: string, openingHours: object }>} data
 */
async function update(id, data) {
  return prisma.restaurant.update({ where: { id }, data })
}

/**
 * @param {number} id
 * @param {string} hashedPassword
 */
async function updatePassword(id, hashedPassword) {
  return prisma.restaurant.update({ where: { id }, data: { password: hashedPassword } })
}

export const restaurantRepository = {
  findByEmail,
  findBySlug,
  findById,
  findByIdWithPassword,
  create,
  update,
  updatePassword,
}
