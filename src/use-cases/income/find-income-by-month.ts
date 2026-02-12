import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type FindIncomesByMonthResponse = Income[]

export class FindIncomesByMonthUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(month: string): Promise<FindIncomesByMonthResponse> {
		return await this.repository.findByMonth(month)
	}
}
