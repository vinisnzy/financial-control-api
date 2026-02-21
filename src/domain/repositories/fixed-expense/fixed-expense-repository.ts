import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'

export interface FixedExpenseRepository {
	findAll(): Promise<FixedExpense[]>
	findById(id: string): Promise<FixedExpense | null>
	findByNameAndMonth(name: string, month: string): Promise<FixedExpense | null>
	findByMonth(month: string): Promise<FixedExpense[]>
	findByCategory(category: ExpenseCategory): Promise<FixedExpense[]>
	findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<FixedExpense[]>
	findAllNecessary(): Promise<FixedExpense[]>
	findNecessaryByMonth(month: string): Promise<FixedExpense[]>

	save(expense: FixedExpense): Promise<void>
	create(expense: FixedExpense): Promise<void>
	delete(ex: string): Promise<void>
}
