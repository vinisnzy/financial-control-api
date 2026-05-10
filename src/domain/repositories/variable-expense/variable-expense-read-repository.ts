import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface VariableExpenseReadRepository {
	findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<VariableExpense>>
	findById(id: string, userId: string): Promise<VariableExpense | null>
	findByMonth(month: string, userId: string): Promise<VariableExpense[]>
	findByNameAndMonth(name: string, month: string, userId: string): Promise<VariableExpense | null>
	findByCategory(category: ExpenseCategory, userId: string): Promise<VariableExpense[]>
	findByCategoryAndMonth(category: ExpenseCategory, month: string, userId: string): Promise<VariableExpense[]>
	findAllNecessary(userId: string): Promise<VariableExpense[]>
	findNecessaryByMonth(month: string, userId: string): Promise<VariableExpense[]>
}
