import type { Income } from '@/domain/entities/income/income.js'
import type { CreateIncomeInput } from './dtos/create-income-input.dto.js'

export interface IncomeRepository {
	findAll(): Promise<Income[]>
	findById(id: string): Promise<Income | null>
	findByNameAndMonth(name: string, month: string): Promise<Income | null>
	findByMonth(month: string): Promise<Income[]>

	save(income: Income): Promise<void>
	create(data: CreateIncomeInput): Promise<void>
	delete(id: string): Promise<void>
}
