import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpensesByCategoryAndMonthResponse = FixedExpense[]

export class FindFixedExpensesByCategoryAndMonthUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(category: ExpenseCategory, month: string): Promise<FindFixedExpensesByCategoryAndMonthResponse> {
		return this.repository.findByCategoryAndMonth(category, month)
	}
}
