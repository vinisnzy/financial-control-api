import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindAllNecessaryVariableExpensesResponse = VariableExpense[]

export class FindAllNecessaryVariableExpensesUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(): Promise<FindAllNecessaryVariableExpensesResponse> {
		return this.repository.findAllNecessary()
	}
}
