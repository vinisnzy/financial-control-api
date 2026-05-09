import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { CreateFixedExpenseInput } from './dtos/create-fixed-expense-input.dto.js'

export interface FixedExpenseWriteRepository {
	save(expense: FixedExpense): Promise<void>
	create(data: CreateFixedExpenseInput): Promise<void>
	delete(id: string): Promise<void>
}
