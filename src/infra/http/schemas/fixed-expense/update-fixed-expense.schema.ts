import z from 'zod'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'

export const updateFixedExpenseSchema = z.object({
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
	name: z.string().min(1),
	amount: z.number().positive(),
	category: z.enum(ExpenseCategory),
	necessary: z.boolean(),
})

export type UpdateFixedExpenseRequest = z.infer<typeof updateFixedExpenseSchema>
