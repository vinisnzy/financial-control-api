import type { ExpenseCategory } from '@/domain/enums/expense-category.js'

export interface UpdateFixedExpenseInput {
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
}
