import z from 'zod'
import { hasMoreThanTwoDecimals } from '@/utils/number-has-more-whan-two-decimals.js'

export const updateIncomeSchema = z.object({
	name: z.string().min(1),
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
	amount: z
		.number()
		.positive()
		.refine((a) => !hasMoreThanTwoDecimals(a), { message: 'Maximum 2 decimal places' }),
})

export type UpdateIncomeRequest = z.infer<typeof updateIncomeSchema>
