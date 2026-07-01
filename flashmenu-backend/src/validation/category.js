import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').trim(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').trim(),
})

export const reorderCategoriesSchema = z.object({
  categories: z
    .array(
      z.object({
        id: z.number().int().positive(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1, 'Informe ao menos uma categoria para reordenar'),
})
