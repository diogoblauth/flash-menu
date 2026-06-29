import { Router } from 'express'
import { loginSchema, registerSchema } from '../validation/auth.js'
import { loginService, registerService, getMeService } from '../services/auth.js'
import { authenticate } from '../middleware/authenticate.js'
import { loginLimiter, registerLimiter } from '../middleware/rate-limiter.js'

const router = Router()

// POST /api/v1/auth/login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body)
    const result = await loginService(body)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// POST /api/v1/auth/register
router.post('/register', registerLimiter, async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body)
    const result = await registerService(body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

// GET /api/v1/auth/me — valida o token e retorna dados do restaurante autenticado
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const restaurant = await getMeService(req.decoded.restaurantId)
    res.json(restaurant)
  } catch (error) {
    next(error)
  }
})

export default router
