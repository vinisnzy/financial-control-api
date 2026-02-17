import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type FindIncomeByNameAndMonthResponse = Income

export class FindIncomeByNameAndMonthUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(name: string, month: string): Promise<FindIncomeByNameAndMonthResponse | null> {
		return this.repository.findByNameAndMonth(name, month)
	}
}
