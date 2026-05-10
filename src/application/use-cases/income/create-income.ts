import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { CreateIncomeInput } from '@/domain/repositories/income/dtos/create-income-input.dto.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

export class CreateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(request: CreateIncomeInput): Promise<void> {
		const { name, month, userId } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month, userId)
		if (alreadyExists) {
			throw new BadRequestError(`There is already a income with the name: ${name}, and the month: ${month}`)
		}
		this.repository.create(request, userId)
	}
}
