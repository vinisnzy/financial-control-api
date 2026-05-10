import type { Income } from '@/domain/entities/income/income.js'
import type { CreateIncomeInput } from './dtos/create-income-input.dto.js'

export interface IncomeWriteRepository {
	save(income: Income, userId: string): Promise<void>
	create(data: CreateIncomeInput, userId: string): Promise<void>
	delete(id: string, userId: string): Promise<void>
}
