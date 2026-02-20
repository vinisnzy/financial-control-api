import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpenseByIdResponse = FixedExpense

export class FindFixedExpenseByIdUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string): Promise<FindFixedExpenseByIdResponse> {
		const fixedExpense = await this.repository.findById(id)
		if (!fixedExpense) {
			throw new Error(`Fixed expense not found with id: ${id}`)
		}
		return fixedExpense
	}
}
