import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense.js'
import type { UpdateVariableExpenseRequest } from '@/infra/http/schemas/variable-expense/update-variable-expense.schema.js'

export class UpdateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string, request: UpdateVariableExpenseRequest): Promise<void> {
		const { name, month, date } = request
		const all = await this.repository.findByMonth(month)
		if (all.some((e) => e.name === name && e.date === date && e.id !== id)) {
			throw new BadRequestError(`Already exists a variable expense with name: ${name} and date: ${date}`)
		}
		await this.repository.save(
			new VariableExpense({
				id,
				...request,
			}),
		)
	}
}
