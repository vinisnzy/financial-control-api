import z from 'zod'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'

export const categoryParamSchema = z.object({
	category: z.enum(ExpenseCategory),
})

export type categoryParamRequest = z.infer<typeof categoryParamSchema>
