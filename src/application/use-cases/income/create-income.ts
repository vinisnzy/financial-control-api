import { httpErrors } from '@fastify/sensible'
import type { CreateIncomeInput } from '@/domain/repositories/income/dtos/create-income-input.dto.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

export class CreateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(request: CreateIncomeInput): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw httpErrors.badRequest(`There is already a income with the name: ${name}, and the month: ${month}`)
		}
		this.repository.create(request)
	}
}
