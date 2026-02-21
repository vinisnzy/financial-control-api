import { Income } from '@/domain/entities/income/income.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'
import type { UpdateIncomeRequest } from '@/infra/http/schemas/income/update-income.schema.js'

export class UpdateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string, request: UpdateIncomeRequest): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw new BadRequestError(`There is already a recipe with the name: ${name}, and the month: ${month}`)
		}
		await this.repository.save(new Income({ id, ...request }))
	}
}
