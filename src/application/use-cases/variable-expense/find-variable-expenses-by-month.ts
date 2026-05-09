import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

type FindVariableExpensesByMonthResponse = VariableExpense[]

export class FindVariableExpensesByMonthUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(month: string): Promise<FindVariableExpensesByMonthResponse> {
		return this.repository.findByMonth(month)
	}
}
