import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface FixedExpenseReadRepository {
		findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<FixedExpense>>
		findById(id: string, userId: string): Promise<FixedExpense | null>
		findByNameAndMonth(name: string, month: string, userId: string): Promise<FixedExpense | null>
		findByMonth(month: string, userId: string): Promise<FixedExpense[]>
		findByCategory(category: ExpenseCategory, userId: string): Promise<FixedExpense[]>
		findByCategoryAndMonth(category: ExpenseCategory, month: string, userId: string): Promise<FixedExpense[]>
		findAllNecessary(userId: string): Promise<FixedExpense[]>
		findNecessaryByMonth(month: string, userId: string): Promise<FixedExpense[]>
	}
