import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'

export class DeleteIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(id: string): Promise<void> {
		await this.repository.delete(id)
	}
}
