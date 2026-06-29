import { Router } from 'express'

const router = Router()

// Vitrine pública do restaurante por slug.
// Stub — será implementado na próxima etapa junto com CRUD de categorias/itens.
router.get('/cardapio/:slug', async (_req, res) => {
  res.status(501).json({ message: 'Em breve' })
})

export default router
