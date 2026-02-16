import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindVariableExpensesByMonthResponse = VariableExpense[]

export class FindVariableExpensesByMonthUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(month: string): Promise<FindVariableExpensesByMonthResponse> {
		return this.repository.findByMonth(month)
	}
}
