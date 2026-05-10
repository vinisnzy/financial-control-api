import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { UpdateVariableExpenseInput } from '@/application/dtos/variable-expense/update-variable-expense-input.dto.js'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

export class UpdateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string, request: UpdateVariableExpenseInput): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw new BadRequestError(`Already exists a variable expense with name: ${name} and month: ${month}`)
		}
		await this.repository.save(
			new VariableExpense({
				id,
				...request,
			}),
		)
	}
}
