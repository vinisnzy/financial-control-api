import { randomUUID } from 'node:crypto'
import type { CreateVariableExpenseInput } from '@/application/dtos/variable-expense/create-variable-expense-input.dto.js'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense.js'

export class CreateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(request: CreateVariableExpenseInput): Promise<void> {
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
