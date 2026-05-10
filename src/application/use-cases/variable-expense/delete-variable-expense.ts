import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

export class DeleteVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string, userId: string) {
		await this.repository.delete(id, userId)
	}
}
