import { z } from 'zod'
import { slugify } from '../core/slug.js'

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

// Horário de um único dia. Se aberto (closed=false), abre e fecha são obrigatórios e abre < fecha.
const dayHoursSchema = z
  .object({
    closed: z.boolean(),
    open: z.string().regex(timeRegex, 'Horário deve estar no formato HH:MM').optional(),
    close: z.string().regex(timeRegex, 'Horário deve estar no formato HH:MM').optional(),
  })
  .refine((d) => d.closed || (d.open != null && d.close != null), {
    message: 'Informe os horários de abertura e fechamento quando o dia estiver aberto',
  })
  .refine((d) => d.closed || d.open == null || d.close == null || d.open < d.close, {
    message: 'O horário de abertura deve ser anterior ao de fechamento',
  })

// Horário de funcionamento por dia da semana — todos os dias opcionais.
const openingHoursSchema = z.object({
  seg: dayHoursSchema.optional(),
  ter: dayHoursSchema.optional(),
  qua: dayHoursSchema.optional(),
  qui: dayHoursSchema.optional(),
  sex: dayHoursSchema.optional(),
  sab: dayHoursSchema.optional(),
  dom: dayHoursSchema.optional(),
})

export const updateRestaurantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100).trim().optional(),
  slug: z
    .string()
    .min(2, 'Endereço da vitrine muito curto')
    .max(60, 'Endereço da vitrine muito longo')
    .transform((s) => slugify(s))
    .refine((s) => s.length >= 2, 'Endereço da vitrine inválido')
    .optional(),
  description: z.string().max(500, 'Descrição muito longa').trim().nullable().optional(),
  logo: z.string().url('Logo deve ser uma URL válida').nullable().optional(),
  banner: z.string().url('Banner deve ser uma URL válida').nullable().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor primária deve ser um hex válido (#rrggbb)')
    .optional(),
  openingHours: openingHoursSchema.optional(),
})

export const changePasswordSchema = z.object({
  // max 128: previne bcrypt DoS (mesmo limite do registro/login)
  currentPassword: z.string().min(1, 'Senha atual obrigatória').max(128, 'Senha muito longa'),
  newPassword: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .max(128, 'Senha muito longa'),
})
