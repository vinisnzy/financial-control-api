import { randomUUID } from 'node:crypto'
import type { CreateFixedExpenseInput } from '@/application/dtos/fixed-expense/create-fixed-expense-input.dto.js'
import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

export class CreateFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(request: CreateFixedExpenseInput): Promise<void> {
		const { name, month } = request
		if (await this.repository.findByNameAndMonth(name, month)) {
			throw new BadRequestError(`Alreary exists an fixed expense with name: ${name} and month: ${month}`)
		}
		this.repository.create(
			new FixedExpense({
				id: randomUUID().toString(),
				...request,
			}),
		)
	}
}
