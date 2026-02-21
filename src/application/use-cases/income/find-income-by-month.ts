import type { Income } from '@/domain/entities/income/income.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

type FindIncomesByMonthResponse = Income[]

export class FindIncomesByMonthUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(month: string): Promise<FindIncomesByMonthResponse> {
		return this.repository.findByMonth(month)
	}
}
