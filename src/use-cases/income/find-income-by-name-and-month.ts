import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type findIncomeByNameAndMonthResponse = Income

export class findIncomeByNameAndMonthUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(name: string, month: string): Promise<findIncomeByNameAndMonthResponse | null> {
		return await this.repository.findByNameAndMonth(name, month)
	}
}
