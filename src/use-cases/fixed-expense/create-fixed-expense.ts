import { randomUUID } from 'node:crypto'
import { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'
import type { CreateFixedExpenseRequest } from '@/schemas/fixed-expense/create-fixed-expense.schema.js'

export class CreateFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(request: CreateFixedExpenseRequest): Promise<void> {
		const { name, month } = request
		if (await this.repository.findByNameAndMonth(name, month)) {
			throw new Error(`Alreary exists an fixed expense with name: ${name} and month: ${month}`)
		}
		this.repository.create(
			new FixedExpense({
				id: randomUUID().toString(),
				...request,
			}),
		)
	}
}
