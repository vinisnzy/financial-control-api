import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpensesByMonthResponse = FixedExpense[]

export class FindFixedExpensesByMonthUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(month: string): Promise<FindFixedExpensesByMonthResponse> {
		return this.repository.findByMonth(month)
	}
}
