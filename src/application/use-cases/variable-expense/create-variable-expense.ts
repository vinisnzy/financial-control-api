import type { CreateVariableExpenseInput } from '@/domain/repositories/variable-expense/dtos/create-variable-expense-input.dto.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

export class CreateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(request: CreateVariableExpenseInput): Promise<void> {
		await this.repository.create(request)
	}
}
