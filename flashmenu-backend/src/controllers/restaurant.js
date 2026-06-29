import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/verify-token.js'
import { restaurantRepository } from '../repositories/restaurant.js'

const router = Router()

router.get('/restaurante', authenticate, async (req, res, next) => {
  try {
    const restaurant = await restaurantRepository.findById(req.decoded.restaurantId)
    res.json(restaurant)
  } catch (error) {
    next(error)
  }
})

router.put('/restaurante', authenticate, async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        logo: z.string().url().optional(),
        primaryColor: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/, 'Cor primária deve ser um hex válido (#rrggbb)')
          .optional(),
      })
      .parse(req.body)

    const updated = await restaurantRepository.update(req.decoded.restaurantId, body)
    const { password: _, ...safe } = updated
    res.json(safe)
  } catch (error) {
    next(error)
  }
})

export default router
