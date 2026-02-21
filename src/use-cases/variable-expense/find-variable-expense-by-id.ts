import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindVariableExpenseByIdResponse = VariableExpense

export class FindVariableExpenseByIdUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string): Promise<FindVariableExpenseByIdResponse> {
		const expense = await this.repository.findById(id)
		if (!expense) {
			throw new ResourceNotFoundError(`Variable expense not found with id: ${id}`)
		}
		return expense
	}
}
