import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpensesByMonthResponse = FixedExpense[]

export class FindFixedExpensesByMonthUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(month: string, userId: string): Promise<FindFixedExpensesByMonthResponse> {
		return this.repository.findByMonth(month, userId)
	}
}
