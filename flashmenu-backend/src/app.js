import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import authController from './controllers/auth.js'
import restaurantController from './controllers/restaurant.js'
import menuController from './controllers/menu.js'
import { errorHandler } from './middleware/error-handler.js'

const isProd = process.env.NODE_ENV === 'production'

export const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(helmet())
app.use(
  cors({
    origin: isProd ? process.env.CORS_ORIGIN : ['http://localhost:9000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

// Rate limiting global — desativado fora de produção
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  skip: () => !isProd,
  message: { message: 'Muitas requisições, tente novamente mais tarde.' },
})

// Rate limiting para rotas de auth — proteção contra força bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skip: () => !isProd,
  message: { message: 'Muitas tentativas de login, tente novamente mais tarde.' },
})

app.use(limiter)

app.use(authLimiter, authController)
app.use(restaurantController)
app.use(menuController)

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

app.use(errorHandler)
