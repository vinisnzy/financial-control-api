import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'

type FindAllVariableExpensesResponse = PaginatedResult<VariableExpense>

export class FindAllVariableExpensesUseCase {
	constructor(private repository: VariableExpenseRepository) {}

	async execute(userId: string, pagination?: PaginationInput): Promise<FindAllVariableExpensesResponse> {
		return this.repository.findAll(userId, pagination)
	}
}
