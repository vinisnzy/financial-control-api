import { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'
import type { UpdateFixedExpenseRequest } from '@/schemas/fixed-expense/update-fixed-expense.schema.js'

export class UpdateFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string, request: UpdateFixedExpenseRequest): Promise<void> {
		const { name, month } = request
		if (await this.repository.findByNameAndMonth(name, month)) {
			throw new Error(`Alreary exists an fixed expense with name: ${name} and month: ${month}`)
		}
		this.repository.save(
			new FixedExpense({
				id,
				...request,
			}),
		)
	}
}
