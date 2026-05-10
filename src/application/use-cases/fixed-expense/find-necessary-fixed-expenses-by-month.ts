import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

type FindNecessaryFixedExpensesByMonthResponse = FixedExpense[]

export class FindNecessaryFixedExpensesByMonthUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(month: string, userId: string): Promise<FindNecessaryFixedExpensesByMonthResponse> {
		return this.repository.findNecessaryByMonth(month, userId)
	}
}
