import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindAllVariableExpensesResponse = VariableExpense[]

export class FindAllVariableExpensesUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(): Promise<FindAllVariableExpensesResponse> {
		return this.repository.findAll()
	}
}
