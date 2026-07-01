import { prisma } from '../database/prisma.js'

async function findAllByRestaurant(restaurantId) {
  return prisma.item.findMany({
    where: { restaurantId },
    orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
  })
}

async function findById(id) {
  return prisma.item.findUnique({ where: { id } })
}

async function getMaxSortOrder(restaurantId, categoryId) {
  const result = await prisma.item.aggregate({
    where: { restaurantId, categoryId: categoryId ?? null },
    _max: { sortOrder: true },
  })
  return result._max.sortOrder
}

async function create({ restaurantId, categoryId, name, description, price, photo, active, sortOrder }) {
  return prisma.item.create({
    data: { restaurantId, categoryId: categoryId ?? null, name, description, price, photo, active, sortOrder },
  })
}

async function update(id, { name, description, price, photo, categoryId }) {
  return prisma.item.update({
    where: { id },
    data: { name, description, price, photo, categoryId: categoryId ?? null },
  })
}

async function updateActive(id, active) {
  return prisma.item.update({ where: { id }, data: { active } })
}

async function updateSortOrders(updates) {
  return prisma.$transaction(
    updates.map(({ id, sortOrder }) => prisma.item.update({ where: { id }, data: { sortOrder } })),
  )
}

async function remove(id) {
  return prisma.item.delete({ where: { id } })
}

export const itemRepository = {
  findAllByRestaurant,
  findById,
  getMaxSortOrder,
  create,
  update,
  updateActive,
  updateSortOrders,
  remove,
}
