import { randomUUID } from 'node:crypto'
import { Income } from '@/entities/income/income.js'
import { BadRequestError } from '@/errors/bad-request-error.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'
import type { CreateIncomeRequest } from '@/schemas/income/create-income.schema.js'

export class CreateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(request: CreateIncomeRequest): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw new BadRequestError(`There is already a recipe with the name: ${name}, and the month: ${month}`)
		}
		this.repository.create(
			new Income({
				id: randomUUID().toString(),
				...request,
			}),
		)
	}
}
