import type { UpdateFixedExpenseInput } from '@/application/dtos/fixed-expense/update-fixed-expense-input.dto.js'
import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

export class UpdateFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string, request: UpdateFixedExpenseInput): Promise<void> {
		const { name, month } = request
		if (await this.repository.findByNameAndMonth(name, month)) {
			throw new BadRequestError(`Already exists an fixed expense with name: ${name} and month: ${month}`)
		}
		await this.repository.save(
			new FixedExpense({
				id,
				...request,
			}),
		)
	}
}
