import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

type FindAllFixedExpensesResponse = FixedExpense[]

export class FindAllFixedExpensesUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(): Promise<FindAllFixedExpensesResponse> {
		return this.repository.findAll()
	}
}
