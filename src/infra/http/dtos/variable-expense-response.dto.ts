import type { ExpenseCategory } from '@/domain/enums/expense-category.js'

export interface VariableExpenseResponseDTO {
	id: string
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
	date: string
}
