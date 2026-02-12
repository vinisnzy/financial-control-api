import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type findIncomeByIdResponse = Income

export class findIncomeByIdUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string): Promise<findIncomeByIdResponse | null> {
		return await this.repository.findById(id)
	}
}
