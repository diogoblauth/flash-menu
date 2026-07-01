import { Router } from 'express'
import authRoutes from './auth.routes.js'
import restaurantRoutes from './restaurant.routes.js'
import categoryRoutes from './category.routes.js'
import itemRoutes from './item.routes.js'
import publicRoutes from './public.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/restaurants', restaurantRoutes)
router.use('/restaurants/me/categories', categoryRoutes)
router.use('/restaurants/me/items', itemRoutes)
router.use('/public', publicRoutes)

export default router
