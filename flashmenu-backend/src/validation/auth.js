import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').transform((s) => s.toLowerCase().trim()),
  // max 128: previne bcrypt DoS (bcrypt silently truncates at 72 bytes, mas o custo de CPU é real)
  password: z.string().min(1, 'Senha obrigatória').max(128, 'Senha muito longa'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .transform((s) => s.trim()),
  email: z.string().email('E-mail inválido').transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .max(128, 'Senha muito longa'),
})
