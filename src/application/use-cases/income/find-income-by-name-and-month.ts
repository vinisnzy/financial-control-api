import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { Income } from '@/domain/entities/income/income.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

type FindIncomeByNameAndMonthResponse = Income

export class FindIncomeByNameAndMonthUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(name: string, month: string): Promise<FindIncomeByNameAndMonthResponse> {
		const income = await this.repository.findByNameAndMonth(name, month)
		if (!income) {
			throw new ResourceNotFoundError(`Income not found with name: ${name} and month: ${month}`)
		}
		return income
	}
}
