import { randomUUID } from 'node:crypto'
import type { CreateIncomeInput } from '@/application/dtos/income/create-income-input.dto.js'
import { Income } from '@/domain/entities/income/income.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

export class CreateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(request: CreateIncomeInput): Promise<void> {
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
