import { Router } from 'express'
import authRoutes from './auth.routes.js'
import restaurantRoutes from './restaurant.routes.js'
import publicRoutes from './public.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/restaurants', restaurantRoutes)
router.use('/public', publicRoutes)

export default router
