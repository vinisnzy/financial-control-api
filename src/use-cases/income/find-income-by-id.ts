import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

type FindIncomeByIdResponse = Income

export class FindIncomeByIdUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string): Promise<FindIncomeByIdResponse | null> {
		return this.repository.findById(id)
	}
}
