import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense.js'

type FindAllVariableExpensesResponse = VariableExpense[]

export class FindAllVariableExpensesUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(): Promise<FindAllVariableExpensesResponse> {
		return this.repository.findAll()
	}
}
