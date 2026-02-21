import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'
import type { UpdateFixedExpenseRequest } from '@/infra/http/schemas/fixed-expense/update-fixed-expense.schema.js'

export class UpdateFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string, request: UpdateFixedExpenseRequest): Promise<void> {
		const { name, month } = request
		if (await this.repository.findByNameAndMonth(name, month)) {
			throw new BadRequestError(`Alreary exists an fixed expense with name: ${name} and month: ${month}`)
		}
		await this.repository.save(
			new FixedExpense({
				id,
				...request,
			}),
		)
	}
}
