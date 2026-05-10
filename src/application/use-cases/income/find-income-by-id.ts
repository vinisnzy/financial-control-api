import type { Income } from '@/domain/entities/income/income.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

type FindIncomeByIdResponse = Income

export class FindIncomeByIdUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string, userId: string): Promise<FindIncomeByIdResponse> {
		const income = await this.repository.findById(id, userId)
		if (!income) {
			throw new ResourceNotFoundError(`Income not found with id: ${id}`)
		}
		return income
	}
}
