import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type FindAllIncomesResponse = Income[]

export class FindAllIncomesUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(): Promise<FindAllIncomesResponse> {
		return await this.repository.findAll()
	}
}
