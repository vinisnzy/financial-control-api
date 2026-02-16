import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpensesByCategoryResponse = FixedExpense[]

export class FindFixedExpensesByCategoryUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(category: ExpenseCategory): Promise<FindFixedExpensesByCategoryResponse | null> {
		return this.repository.findByCategory(category)
	}
}
