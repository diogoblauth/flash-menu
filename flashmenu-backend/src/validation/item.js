import { z } from 'zod'

export const createItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').trim(),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').trim().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  photo: z.string().url('Foto deve ser uma URL válida').optional().nullable(),
  categoryId: z.number().int().positive().optional().nullable(),
  active: z.boolean().optional(),
})

export const updateItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').trim(),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').trim().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  photo: z.string().url('Foto deve ser uma URL válida').optional().nullable(),
  categoryId: z.number().int().positive().optional().nullable(),
})

export const toggleActiveSchema = z.object({
  active: z.boolean(),
})

export const reorderItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1, 'Informe ao menos um item para reordenar'),
})
