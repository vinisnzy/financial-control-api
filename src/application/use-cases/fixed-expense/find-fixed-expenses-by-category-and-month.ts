import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpensesByCategoryAndMonthResponse = FixedExpense[]

export class FindFixedExpensesByCategoryAndMonthUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(category: ExpenseCategory, month: string): Promise<FindFixedExpensesByCategoryAndMonthResponse> {
		return this.repository.findByCategoryAndMonth(category, month)
	}
}
