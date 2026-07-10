import { Router } from 'express'
import QRCode from 'qrcode'
import { authenticate } from '../middleware/authenticate.js'
import { dashboardRepository } from '../repositories/dashboard.js'
import { restaurantRepository } from '../repositories/restaurant.js'

const router = Router()

router.use(authenticate)

// GET /api/v1/restaurants/me/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = await dashboardRepository.getStats(req.decoded.restaurantId)
    res.json({ dashboard: stats })
  } catch (error) {
    next(error)
  }
})

// GET /api/v1/restaurants/me/qrcode
router.get('/qrcode', async (req, res, next) => {
  try {
    const restaurant = await restaurantRepository.findById(req.decoded.restaurantId)
    const publicUrl = `${process.env.FRONTEND_URL}/${restaurant.slug}`
    const buffer = await QRCode.toBuffer(publicUrl, { type: 'png', width: 512, margin: 2 })
    res.set('Content-Type', 'image/png')
    res.send(buffer)
  } catch (error) {
    next(error)
  }
})

export default router
