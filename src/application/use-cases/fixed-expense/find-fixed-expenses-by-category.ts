import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpensesByCategoryResponse = FixedExpense[]

export class FindFixedExpensesByCategoryUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(category: ExpenseCategory): Promise<FindFixedExpensesByCategoryResponse> {
		return this.repository.findByCategory(category)
	}
}
