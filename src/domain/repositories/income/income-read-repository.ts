import type { Income } from '@/domain/entities/income/income.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface IncomeReadRepository {
	findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<Income>>
	findById(id: string, userId: string): Promise<Income | null>
	findByNameAndMonth(name: string, month: string, userId: string): Promise<Income | null>
	findByMonth(month: string, userId: string): Promise<Income[]>
}
