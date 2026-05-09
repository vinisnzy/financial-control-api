import type { Income } from '@/domain/entities/income/income.js'
import type { CreateIncomeInput } from './dtos/create-income-input.dto.js'

export interface IncomeWriteRepository {
	save(income: Income): Promise<void>
	create(data: CreateIncomeInput): Promise<void>
	delete(id: string): Promise<void>
}
