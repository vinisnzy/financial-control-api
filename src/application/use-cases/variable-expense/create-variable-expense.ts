import { randomUUID } from 'node:crypto'
import type { CreateVariableExpenseInput } from '@/application/dtos/variable-expense/create-variable-expense-input.dto.js'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense.js'

export class CreateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(request: CreateVariableExpenseInput): Promise<void> {
		await this.repository.create(
			new VariableExpense({
				id: randomUUID().toString(),
				...request,
			}),
		)
	}
}
