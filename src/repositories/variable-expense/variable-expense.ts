import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'

export interface VariableExpenseRepository {
	findAll(): Promise<VariableExpense[]>
	findById(id: string): Promise<VariableExpense | null>
	findByMonth(month: string): Promise<VariableExpense[]>
	findByCategory(category: ExpenseCategory): Promise<VariableExpense[]>
	findAllNecessary(): Promise<VariableExpense[]>

	save(expense: VariableExpense): Promise<void>
	create(expense: VariableExpense): Promise<void>
	delete(ex: string): Promise<void>
}
