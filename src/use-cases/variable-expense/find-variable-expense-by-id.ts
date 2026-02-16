import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindVariableExpenseByIdResponse = VariableExpense

export class FindVariableExpenseByIdUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(id: string): Promise<FindVariableExpenseByIdResponse | null> {
		return this.repository.findById(id)
	}
}
