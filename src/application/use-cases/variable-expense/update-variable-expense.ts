import type { UpdateVariableExpenseInput } from '@/application/dtos/variable-expense/update-variable-expense-input.dto.js'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense.js'

export class UpdateVariableExpenseUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string, request: UpdateVariableExpenseInput): Promise<void> {
		await this.repository.save(
			new VariableExpense({
				id,
				...request,
			}),
		)
	}
}
