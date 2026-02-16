import type { FixedExpenseRepository } from '@/repositories/fixed-expense/fixed-expense-repository.js'

export class DeleteFixedExpenseUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(id: string) {
		this.repository.delete(id)
	}
}
