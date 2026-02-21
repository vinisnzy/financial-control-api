import type { ExpenseCategory } from '@/domain/enums/expense-category.js'

export interface UpdateVariableExpenseInput {
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
	date: string
}
