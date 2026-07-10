import { prisma } from '../database/prisma.js'

async function getStats(restaurantId) {
  const [
    totalItems,
    activeItems,
    totalCategories,
    categories,
    uncategorizedItems,
    restaurant,
    priceAvg,
    cheapestItem,
    priciestItem,
  ] = await Promise.all([
    prisma.item.count({ where: { restaurantId } }),
    prisma.item.count({ where: { restaurantId, active: true } }),
    prisma.category.count({ where: { restaurantId } }),
    prisma.category.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { items: true } } },
    }),
    prisma.item.count({ where: { restaurantId, categoryId: null } }),
    prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { name: true, slug: true, logo: true, primaryColor: true },
    }),
    prisma.item.aggregate({ where: { restaurantId, active: true }, _avg: { price: true } }),
    prisma.item.findFirst({
      where: { restaurantId, active: true },
      orderBy: { price: 'asc' },
      select: { name: true, price: true },
    }),
    prisma.item.findFirst({
      where: { restaurantId, active: true },
      orderBy: { price: 'desc' },
      select: { name: true, price: true },
    }),
  ])

  const priceStats = cheapestItem
    ? {
        average: priceAvg._avg.price,
        cheapest: { name: cheapestItem.name, price: cheapestItem.price },
        priciest: { name: priciestItem.name, price: priciestItem.price },
      }
    : null

  const itemsByCategory = categories.map((category) => ({
    categoryId: category.id,
    name: category.name,
    itemCount: category._count.items,
  }))

  if (uncategorizedItems > 0) {
    itemsByCategory.push({ categoryId: null, name: 'Sem categoria', itemCount: uncategorizedItems })
  }

  return {
    totalItems,
    activeItems,
    inactiveItems: totalItems - activeItems,
    totalCategories,
    itemsByCategory,
    priceStats,
    restaurant: {
      ...restaurant,
      publicUrl: `${process.env.FRONTEND_URL}/${restaurant.slug}`,
    },
  }
}

export const dashboardRepository = {
  getStats,
}
