import type { UpdateIncomeInput } from '@/application/dtos/income/update-income-input.dto.js'
import { Income } from '@/domain/entities/income/income.js'
import { BadRequestError } from '@/domain/errors/bad-request-error.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

export class UpdateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string, request: UpdateIncomeInput): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw new BadRequestError(`There is already a income with the name: ${name}, and the month: ${month}`)
		}
		await this.repository.save(new Income({ id, ...request }))
	}
}
