import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface VariableExpenseReadRepository {
	findAll(pagination?: PaginationInput): Promise<PaginatedResult<VariableExpense>>
	findById(id: string): Promise<VariableExpense | null>
	findByMonth(month: string): Promise<VariableExpense[]>
	findByNameAndMonth(name: string, month: string): Promise<VariableExpense | null>
	findByCategory(category: ExpenseCategory): Promise<VariableExpense[]>
	findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<VariableExpense[]>
	findAllNecessary(): Promise<VariableExpense[]>
	findNecessaryByMonth(month: string): Promise<VariableExpense[]>
}
