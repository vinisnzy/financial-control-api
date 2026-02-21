import type { Income } from '@/domain/entities/income/income.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

type FindAllIncomesResponse = Income[]

export class FindAllIncomesUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(): Promise<FindAllIncomesResponse> {
		return this.repository.findAll()
	}
}
