import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

type FindAllNecessaryFixedExpensesResponse = FixedExpense[]

export class FindAllNecessaryFixedExpensesUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(): Promise<FindAllNecessaryFixedExpensesResponse> {
		return this.repository.findAllNecessary()
	}
}
