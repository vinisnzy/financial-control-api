import type { Income } from '@/domain/entities/income/income.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'

type FindAllIncomesResponse = PaginatedResult<Income>

export class FindAllIncomesUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(pagination?: PaginationInput): Promise<FindAllIncomesResponse> {
		return this.repository.findAll(pagination)
	}
}
