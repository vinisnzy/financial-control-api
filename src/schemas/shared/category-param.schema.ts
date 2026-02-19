import z from 'zod'
import { ExpenseCategory } from '@/enums/expense-category.js'

export const categoryParamSchema = z.object({
	category: z.enum(ExpenseCategory),
})

export type categoryParamRequest = z.infer<typeof categoryParamSchema>
