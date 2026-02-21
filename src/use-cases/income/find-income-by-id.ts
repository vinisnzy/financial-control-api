import type { Income } from '@/entities/income/income.js'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type FindIncomeByIdResponse = Income

export class FindIncomeByIdUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string): Promise<FindIncomeByIdResponse> {
		const income = await this.repository.findById(id)
		if (!income) {
			throw new ResourceNotFoundError(`Income not found with id: ${id}`)
		}
		return income
	}
}
