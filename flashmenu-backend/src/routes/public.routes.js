import { Router } from 'express'

const router = Router()

// GET /api/v1/public/:slug — vitrine pública do restaurante (sem autenticação)
// Stub — implementado junto com CRUD de categorias e itens
router.get('/:slug', async (_req, res) => {
  res.status(501).json({ message: 'Em breve' })
})

export default router
