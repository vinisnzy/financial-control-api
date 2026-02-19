import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

type FindNecessaryFixedExpensesByMonthResponse = FixedExpense[]

export class FindNecessaryFixedExpensesByMonthUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(month: string): Promise<FindNecessaryFixedExpensesByMonthResponse | null> {
		return this.repository.findNecessaryByMonth(month)
	}
}
