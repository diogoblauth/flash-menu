import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { globalLimiter } from './middleware/rate-limiter.js'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/error-handler.js'

const isProd = process.env.NODE_ENV === 'production'

export const app = express()

// Limite conservador — uploads de foto terão middleware próprio quando implementados
app.use(express.json({ limit: '1mb' }))
app.use(helmet())
app.use(
  cors({
    origin: isProd
      ? process.env.CORS_ORIGIN
      : (origin, cb) => {
          // Permite qualquer porta localhost em desenvolvimento
          if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) cb(null, true)
          else cb(new Error('Not allowed by CORS'))
        },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(globalLimiter)
app.use('/api/v1', apiRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})
app.use(errorHandler)
