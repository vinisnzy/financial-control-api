import z from 'zod'
import { ExpenseCategory } from '@/enums/expense-category.js'

export const categoryAndMonthParamsSchema = z.object({
	category: z.enum(ExpenseCategory),
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
})

export type categoryAndMonthParamRequest = z.infer<typeof categoryAndMonthParamsSchema>
