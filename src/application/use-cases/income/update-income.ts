import { httpErrors } from '@fastify/sensible'
import type { UpdateIncomeInput } from '@/application/dtos/income/update-income-input.dto.js'
import { Income } from '@/domain/entities/income/income.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

export class UpdateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string, request: UpdateIncomeInput): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw httpErrors.badRequest(`There is already a income with the name: ${name}, and the month: ${month}`)
		}
		await this.repository.save(new Income({ id, ...request }))
	}
}
