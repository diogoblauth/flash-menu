import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { upload } from '../middleware/upload.js'
import { uploadRepository } from '../repositories/upload.js'
import { BadRequestError } from '../core/errors/http-errors.js'

const router = Router()

router.use(authenticate)

// POST /api/v1/uploads
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new BadRequestError('Nenhum arquivo enviado')

    const restaurantId = req.decoded.restaurantId
    const result = await uploadRepository.uploadImage(req.file.buffer, `flashmenu/${restaurantId}`)
    res.status(201).json({ url: result.secure_url })
  } catch (error) {
    next(error)
  }
})

export default router
