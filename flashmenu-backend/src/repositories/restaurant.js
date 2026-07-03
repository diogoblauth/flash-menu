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
    select: { id: true, name: true, slug: true, description: true, logo: true, primaryColor: true, openingHours: true, email: true, createdAt: true },
  })
}

/**
 * @param {{ name: string, slug: string, email: string, password: string }} data
 */
async function create(data) {
  return prisma.restaurant.create({ data })
}

/**
 * @param {number} id
 * @param {Partial<{ name: string, description: string, logo: string, primaryColor: string, openingHours: object }>} data
 */
async function update(id, data) {
  return prisma.restaurant.update({ where: { id }, data })
}

export const restaurantRepository = { findByEmail, findBySlug, findById, create, update }
