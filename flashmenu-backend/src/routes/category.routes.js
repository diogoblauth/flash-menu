import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { categoryRepository } from '../repositories/category.js'
import { createCategorySchema, updateCategorySchema, reorderCategoriesSchema } from '../validation/category.js'
import { NotFoundError, ForbiddenError, BadRequestError } from '../core/errors/http-errors.js'

const router = Router()

router.use(authenticate)

// GET /api/v1/restaurants/me/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await categoryRepository.findAllByRestaurant(req.decoded.restaurantId)
    res.json({ categories })
  } catch (error) {
    next(error)
  }
})

// POST /api/v1/restaurants/me/categories
router.post('/', async (req, res, next) => {
  try {
    const { name } = createCategorySchema.parse(req.body)
    const restaurantId = req.decoded.restaurantId
    const maxSortOrder = await categoryRepository.getMaxSortOrder(restaurantId)
    const sortOrder = (maxSortOrder ?? -1) + 1
    const category = await categoryRepository.create({ restaurantId, name, sortOrder })
    res.status(201).json({ category })
  } catch (error) {
    next(error)
  }
})

// PUT /api/v1/restaurants/me/categories/reorder — deve vir antes de /:id
router.put('/reorder', async (req, res, next) => {
  try {
    const { categories } = reorderCategoriesSchema.parse(req.body)
    const restaurantId = req.decoded.restaurantId

    const owned = await categoryRepository.findAllByRestaurant(restaurantId)
    const ownedIds = new Set(owned.map((c) => c.id))
    const allOwned = categories.every(({ id }) => ownedIds.has(id))
    if (!allOwned) throw new ForbiddenError('Uma ou mais categorias não pertencem a este restaurante')

    await categoryRepository.updateSortOrders(categories)
    res.json({ message: 'Ordem atualizada com sucesso' })
  } catch (error) {
    next(error)
  }
})

// PUT /api/v1/restaurants/me/categories/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { name } = updateCategorySchema.parse(req.body)

    const existing = await categoryRepository.findById(id)
    if (!existing) throw new NotFoundError('Categoria não encontrada')
    if (existing.restaurantId !== req.decoded.restaurantId) throw new ForbiddenError()

    const category = await categoryRepository.update(id, { name })
    res.json({ category })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/v1/restaurants/me/categories/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const existing = await categoryRepository.findById(id)
    if (!existing) throw new NotFoundError('Categoria não encontrada')
    if (existing.restaurantId !== req.decoded.restaurantId) throw new ForbiddenError()

    const itemCount = await categoryRepository.countItems(id)
    if (itemCount > 0) throw new BadRequestError('Não é possível excluir uma categoria com itens vinculados')

    await categoryRepository.remove(id)
    res.json({ message: 'Categoria excluída com sucesso' })
  } catch (error) {
    next(error)
  }
})

export default router
