import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

type FindAllNecessaryVariableExpensesResponse = VariableExpense[]

export class FindAllNecessaryVariableExpensesUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(userId: string): Promise<FindAllNecessaryVariableExpensesResponse> {
		return this.repository.findAllNecessary(userId)
	}
}
