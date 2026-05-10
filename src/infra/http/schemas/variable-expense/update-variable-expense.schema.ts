import z from 'zod'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { hasMoreThanTwoDecimals } from '@/utils/number-has-more-whan-two-decimals.js'

export const updateVariableExpenseSchema = z.object({
	month: z.string().regex(/^(?:\d{4})-(?:0[1-9]|1[0-2])$/, 'O mês e ano devem estar no formato: YYYY-DD'),
	name: z.string().min(1),
	amount: z
		.number()
		.positive()
		.refine((a) => !hasMoreThanTwoDecimals(a), { message: 'Maximum 2 decimal places' }),
	category: z.enum(ExpenseCategory),
	necessary: z.boolean(),
	date: z.coerce.date().optional(),
})

export type UpdateVariableExpenseRequest = z.infer<typeof updateVariableExpenseSchema>
