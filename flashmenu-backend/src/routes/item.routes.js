import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { itemRepository } from '../repositories/item.js'
import { categoryRepository } from '../repositories/category.js'
import { createItemSchema, updateItemSchema, toggleActiveSchema, reorderItemsSchema } from '../validation/item.js'
import { NotFoundError, ForbiddenError } from '../core/errors/http-errors.js'

const router = Router()

router.use(authenticate)

async function assertCategoryOwnership(categoryId, restaurantId) {
  if (categoryId === undefined || categoryId === null) return
  const category = await categoryRepository.findById(categoryId)
  if (!category) throw new NotFoundError('Categoria não encontrada')
  if (category.restaurantId !== restaurantId) throw new ForbiddenError('Categoria não pertence a este restaurante')
}

// GET /api/v1/restaurants/me/items
router.get('/', async (req, res, next) => {
  try {
    const items = await itemRepository.findAllByRestaurant(req.decoded.restaurantId)
    res.json({ items })
  } catch (error) {
    next(error)
  }
})

// POST /api/v1/restaurants/me/items
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, photo, categoryId, active } = createItemSchema.parse(req.body)
    const restaurantId = req.decoded.restaurantId

    await assertCategoryOwnership(categoryId, restaurantId)

    const maxSortOrder = await itemRepository.getMaxSortOrder(restaurantId, categoryId ?? null)
    const sortOrder = (maxSortOrder ?? -1) + 1

    const item = await itemRepository.create({
      restaurantId,
      categoryId: categoryId ?? null,
      name,
      description,
      price,
      photo,
      active: active ?? true,
      sortOrder,
    })
    res.status(201).json({ item })
  } catch (error) {
    next(error)
  }
})

// PUT /api/v1/restaurants/me/items/reorder — deve vir antes de /:id
router.put('/reorder', async (req, res, next) => {
  try {
    const { items } = reorderItemsSchema.parse(req.body)
    const restaurantId = req.decoded.restaurantId

    const owned = await itemRepository.findAllByRestaurant(restaurantId)
    const ownedIds = new Set(owned.map((i) => i.id))
    const allOwned = items.every(({ id }) => ownedIds.has(id))
    if (!allOwned) throw new ForbiddenError('Um ou mais itens não pertencem a este restaurante')

    await itemRepository.updateSortOrders(items)
    res.json({ message: 'Ordem atualizada com sucesso' })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/v1/restaurants/me/items/:id/active
router.patch('/:id/active', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { active } = toggleActiveSchema.parse(req.body)

    const existing = await itemRepository.findById(id)
    if (!existing) throw new NotFoundError('Item não encontrado')
    if (existing.restaurantId !== req.decoded.restaurantId) throw new ForbiddenError()

    const item = await itemRepository.updateActive(id, active)
    res.json({ item })
  } catch (error) {
    next(error)
  }
})

// PUT /api/v1/restaurants/me/items/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { name, description, price, photo, categoryId } = updateItemSchema.parse(req.body)
    const restaurantId = req.decoded.restaurantId

    const existing = await itemRepository.findById(id)
    if (!existing) throw new NotFoundError('Item não encontrado')
    if (existing.restaurantId !== restaurantId) throw new ForbiddenError()

    await assertCategoryOwnership(categoryId, restaurantId)

    const item = await itemRepository.update(id, { name, description, price, photo, categoryId })
    res.json({ item })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/v1/restaurants/me/items/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const existing = await itemRepository.findById(id)
    if (!existing) throw new NotFoundError('Item não encontrado')
    if (existing.restaurantId !== req.decoded.restaurantId) throw new ForbiddenError()

    await itemRepository.remove(id)
    res.json({ message: 'Item excluído com sucesso' })
  } catch (error) {
    next(error)
  }
})

export default router
