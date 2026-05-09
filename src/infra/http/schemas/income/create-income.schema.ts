import z from 'zod'

export const createIncomeSchema = z.object({
	name: z.string().min(1),
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-MM'),
	amount: z.number().positive(),
})

export type CreateIncomeRequest = z.infer<typeof createIncomeSchema>
