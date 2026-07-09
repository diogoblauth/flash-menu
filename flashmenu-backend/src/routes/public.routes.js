import { Router } from 'express'
import { restaurantRepository } from '../repositories/restaurant.js'
import { NotFoundError } from '../core/errors/http-errors.js'

const router = Router()

function toPublicItem(item) {
  return { ...item, price: Number(item.price) }
}

// GET /api/v1/public/:slug — vitrine pública do restaurante (sem autenticação)
router.get('/:slug', async (req, res, next) => {
  try {
    const restaurant = await restaurantRepository.findPublicBySlug(req.params.slug)
    if (!restaurant) throw new NotFoundError('Restaurante não encontrado')

    const { categories, items, ...profile } = restaurant

    res.json({
      restaurant: profile,
      categories: categories.map((category) => ({
        ...category,
        items: category.items.map(toPublicItem),
      })),
      uncategorizedItems: items.map(toPublicItem),
    })
  } catch (error) {
    next(error)
  }
})

export default router
