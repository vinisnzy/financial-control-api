import z from 'zod'
import { ExpenseCategory } from '@/enums/expense-category.js'

export const createVariableExpenseSchema = z.object({
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
	name: z.string().min(1),
	amount: z.number().positive(),
	category: z.enum(ExpenseCategory),
	necessary: z.boolean(),
	date: z
		.string()
		.regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/, 'A data deve estar no formato YYYY-MM-DD'),
})

export type CreateVariableExpenseRequest = z.infer<typeof createVariableExpenseSchema>
