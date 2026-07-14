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
    select: { id: true, name: true, slug: true, description: true, logo: true, banner: true, primaryColor: true, openingHours: true, onboardingCompleted: true, email: true, createdAt: true },
  })
}

const publicItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  photo: true,
  active: true,
  sortOrder: true,
}

/**
 * Dados públicos da vitrine em uma única query — sem campos sensíveis (email, password).
 * Itens inativos vêm ao final de cada categoria (active desc).
 * @param {string} slug
 */
async function findPublicBySlug(slug) {
  return prisma.restaurant.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      description: true,
      logo: true,
      banner: true,
      primaryColor: true,
      openingHours: true,
      categories: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          sortOrder: true,
          items: {
            orderBy: [{ active: 'desc' }, { sortOrder: 'asc' }],
            select: publicItemSelect,
          },
        },
      },
      items: {
        where: { categoryId: null },
        orderBy: [{ active: 'desc' }, { sortOrder: 'asc' }],
        select: publicItemSelect,
      },
    },
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

/**
 * Marca o tutorial de onboarding como concluído. Idempotente.
 * @param {number} id
 */
async function completeOnboarding(id) {
  return prisma.restaurant.update({ where: { id }, data: { onboardingCompleted: true } })
}

export const restaurantRepository = {
  findByEmail,
  findBySlug,
  findPublicBySlug,
  findById,
  findByIdWithPassword,
  create,
  update,
  updatePassword,
  completeOnboarding,
}
