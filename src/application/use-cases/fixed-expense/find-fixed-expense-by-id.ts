import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

type FindFixedExpenseByIdResponse = FixedExpense

export class FindFixedExpenseByIdUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string): Promise<FindFixedExpenseByIdResponse> {
		const fixedExpense = await this.repository.findById(id)
		if (!fixedExpense) {
			throw new ResourceNotFoundError(`Fixed expense not found with id: ${id}`)
		}
		return fixedExpense
	}
}
