import z from 'zod'

export const nameAndMonthParamSchema = z.object({
	name: z.string(),
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
})

export type nameAndMonthParamRequest = z.infer<typeof nameAndMonthParamSchema>
