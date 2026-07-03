import { Router } from 'express'
import { updateRestaurantSchema, changePasswordSchema } from '../validation/restaurant.js'
import { restaurantRepository } from '../repositories/restaurant.js'
import { changePasswordService } from '../services/account.js'
import { authenticate } from '../middleware/authenticate.js'

const router = Router()

// GET /api/v1/restaurants/me — perfil do restaurante autenticado
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const restaurant = await restaurantRepository.findById(req.decoded.restaurantId)
    res.json(restaurant)
  } catch (error) {
    next(error)
  }
})

// PUT /api/v1/restaurants/me — atualiza perfil (sem slug — imutável após cadastro)
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const body = updateRestaurantSchema.parse(req.body)
    const updated = await restaurantRepository.update(req.decoded.restaurantId, body)
    const { password: _, ...safe } = updated
    res.json(safe)
  } catch (error) {
    next(error)
  }
})

// PUT /api/v1/restaurants/me/password — troca de senha (confirma a senha atual)
router.put('/me/password', authenticate, async (req, res, next) => {
  try {
    const body = changePasswordSchema.parse(req.body)
    await changePasswordService(req.decoded.restaurantId, body)
    res.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    next(error)
  }
})

export default router
