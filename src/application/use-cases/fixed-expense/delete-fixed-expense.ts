import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'

export class DeleteFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string) {
		await this.repository.delete(id)
	}
}
