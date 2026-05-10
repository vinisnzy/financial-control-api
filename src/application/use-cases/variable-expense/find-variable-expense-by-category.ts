import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

type FindVariableExpensesByCategoryResponse = VariableExpense[]

export class FindVariableExpensesByCategoryUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(category: ExpenseCategory, userId: string): Promise<FindVariableExpensesByCategoryResponse> {
		return this.repository.findByCategory(category, userId)
	}
}
