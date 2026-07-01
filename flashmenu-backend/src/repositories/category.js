import { prisma } from '../database/prisma.js'

async function findAllByRestaurant(restaurantId) {
  return prisma.category.findMany({
    where: { restaurantId },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { items: true } } },
  })
}

async function findById(id) {
  return prisma.category.findUnique({ where: { id } })
}

async function getMaxSortOrder(restaurantId) {
  const result = await prisma.category.aggregate({
    where: { restaurantId },
    _max: { sortOrder: true },
  })
  return result._max.sortOrder
}

async function create({ restaurantId, name, sortOrder }) {
  return prisma.category.create({ data: { restaurantId, name, sortOrder } })
}

async function update(id, { name }) {
  return prisma.category.update({ where: { id }, data: { name } })
}

async function updateSortOrders(updates) {
  return prisma.$transaction(
    updates.map(({ id, sortOrder }) => prisma.category.update({ where: { id }, data: { sortOrder } })),
  )
}

async function remove(id) {
  return prisma.category.delete({ where: { id } })
}

async function countItems(id) {
  return prisma.item.count({ where: { categoryId: id } })
}

export const categoryRepository = {
  findAllByRestaurant,
  findById,
  getMaxSortOrder,
  create,
  update,
  updateSortOrders,
  remove,
  countItems,
}
