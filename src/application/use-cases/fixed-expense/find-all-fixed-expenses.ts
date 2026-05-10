import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'

type FindAllFixedExpensesResponse = PaginatedResult<FixedExpense>

export class FindAllFixedExpensesUseCase {
	constructor(private repository: FixedExpenseRepository) {}

	async execute(pagination: PaginationInput): Promise<FindAllFixedExpensesResponse> {
		return this.repository.findAll(pagination)
	}
}
