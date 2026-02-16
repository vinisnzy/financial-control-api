import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
import type { VariableExpenseRepository } from '@/repositories/variable-expense/variable-expense.js'

type FindVariableExpensesByCategoryResponse = VariableExpense[]

export class FindVariableExpensesByCategoryUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(category: ExpenseCategory): Promise<FindVariableExpensesByCategoryResponse> {
		return this.repository.findByCategory(category)
	}
}
