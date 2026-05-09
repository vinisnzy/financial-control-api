import type { Income } from '@/domain/entities/income/income.js'

export interface IncomeReadRepository {
	findAll(): Promise<Income[]>
	findById(id: string): Promise<Income | null>
	findByNameAndMonth(name: string, month: string): Promise<Income | null>
	findByMonth(month: string): Promise<Income[]>
}
