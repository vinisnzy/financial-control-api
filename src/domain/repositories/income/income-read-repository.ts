import type { Income } from '@/domain/entities/income/income.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface IncomeReadRepository {
	findAll(pagination?: PaginationInput): Promise<PaginatedResult<Income>>
	findById(id: string): Promise<Income | null>
	findByNameAndMonth(name: string, month: string): Promise<Income | null>
	findByMonth(month: string): Promise<Income[]>
}
