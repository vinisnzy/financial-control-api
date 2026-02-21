import type { ExpenseCategory } from '@/enums/expense-category.js'

export interface FixedExpenseResponseDTO {
	id: string
	month: string
	name: string
	amount: number
	category: ExpenseCategory
	necessary: boolean
}
