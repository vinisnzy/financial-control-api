import { httpErrors } from '@fastify/sensible'
import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

type FindVariableExpenseByIdResponse = VariableExpense

export class FindVariableExpenseByIdUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string): Promise<FindVariableExpenseByIdResponse> {
		const expense = await this.repository.findById(id)
		if (!expense) {
			throw httpErrors.notFound(`Variable expense not found with id: ${id}`)
		}
		return expense
	}
}
