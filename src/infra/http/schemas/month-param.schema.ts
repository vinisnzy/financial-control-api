import z from 'zod'

export const monthParamSchema = z.object({
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
})

export type monthParamRequest = z.infer<typeof monthParamSchema>
