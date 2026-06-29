import { Router } from 'express'
import { z } from 'zod'
import { loginService } from '../services/auth.js'
import { cadastroService } from '../services/restaurant.js'

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const body = z
      .object({
        email: z.string().email('E-mail inválido'),
        password: z.string().min(1, 'Senha obrigatória'),
      })
      .parse(req.body)

    const result = await loginService(body)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/restaurante', async (req, res, next) => {
  try {
    const body = z
      .object({
        name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
        email: z.string().email('E-mail inválido'),
        password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
      })
      .parse(req.body)

    const result = await cadastroService(body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

export default router
