import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface FixedExpenseReadRepository {
	findAll(pagination?: PaginationInput): Promise<PaginatedResult<FixedExpense>>
	findById(id: string): Promise<FixedExpense | null>
	findByNameAndMonth(name: string, month: string): Promise<FixedExpense | null>
	findByMonth(month: string): Promise<FixedExpense[]>
	findByCategory(category: ExpenseCategory): Promise<FixedExpense[]>
	findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<FixedExpense[]>
	findAllNecessary(): Promise<FixedExpense[]>
	findNecessaryByMonth(month: string): Promise<FixedExpense[]>
}
