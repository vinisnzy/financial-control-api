import type { Income } from '@/entities/income/income.js'

export interface IncomeRepository {
	findAll(): Promise<Income[]>
	findById(id: string): Promise<Income | null>
	findByMonth(month: string): Promise<Income[]>

	save(income: Income): Promise<void>
	create(income: Income): Promise<void>
	delete(id: string): Promise<void>
}
