import { httpErrors } from '@fastify/sensible'
import type { CreateFixedExpenseInput } from '@/domain/repositories/fixed-expense/dtos/create-fixed-expense-input.dto.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

export class CreateFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(request: CreateFixedExpenseInput): Promise<void> {
		const { name, month } = request
		if (await this.repository.findByNameAndMonth(name, month)) {
			throw httpErrors.badRequest(`Already exists an fixed expense with name: ${name} and month: ${month}`)
		}
		this.repository.create(request)
	}
}
