import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense.js'

type FindNecessaryVariableExpensesByMonthResponse = VariableExpense[]

export class FindNecessaryVariableExpensesByMonthUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(month: string): Promise<FindNecessaryVariableExpensesByMonthResponse> {
		return this.repository.findNecessaryByMonth(month)
	}
}
