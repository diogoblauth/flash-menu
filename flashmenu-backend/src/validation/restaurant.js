import { z } from 'zod'

export const updateRestaurantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100).trim().optional(),
  description: z.string().max(500, 'Descrição muito longa').trim().optional(),
  logo: z.string().url('Logo deve ser uma URL válida').optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor primária deve ser um hex válido (#rrggbb)')
    .optional(),
})
