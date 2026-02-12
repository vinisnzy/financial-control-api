import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'

export interface FixedExpenseRepository {
	findAll(): Promise<FixedExpense[]>
	findById(id: string): Promise<FixedExpense | null>
	findByMonth(month: string): Promise<FixedExpense[]>
	findByCategory(category: ExpenseCategory): Promise<FixedExpense[]>
	findAllNecessary(): Promise<FixedExpense[]>

	save(expense: FixedExpense): Promise<void>
	create(expense: FixedExpense): Promise<void>
	delete(ex: string): Promise<void>
}
