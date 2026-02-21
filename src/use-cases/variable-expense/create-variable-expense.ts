import { randomUUID } from 'node:crypto'
import { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import { BadRequestError } from '@/errors/bad-request-error.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'
import type { CreateVariableExpenseRequest } from '@/schemas/variable-expense/create-variable-expense.schema.js'

export class CreateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(request: CreateVariableExpenseRequest): Promise<void> {
		const { name, month } = request
		// Permite nome repetido por mês, mas não no mesmo mês
		const all = await this.repository.findByMonth(month)
		if (all.some((e) => e.name === name && e.date === request.date)) {
			throw new BadRequestError(`Already exists a variable expense with name: ${name} and date: ${request.date}`)
		}
		await this.repository.create(
			new VariableExpense({
				id: randomUUID().toString(),
				...request,
			}),
		)
	}
}
