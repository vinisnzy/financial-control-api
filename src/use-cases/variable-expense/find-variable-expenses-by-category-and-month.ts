import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindVariableExpensesByCategoryAndMonthResponse = VariableExpense[]

export class FindVariableExpensesByCategoryAndMonthUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(category: ExpenseCategory, month: string): Promise<FindVariableExpensesByCategoryAndMonthResponse> {
		return this.repository.findByCategoryAndMonth(category, month)
	}
}
