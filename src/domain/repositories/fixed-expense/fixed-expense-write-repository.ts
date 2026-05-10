import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { CreateFixedExpenseInput } from './dtos/create-fixed-expense-input.dto.js'

export interface FixedExpenseWriteRepository {
	save(expense: FixedExpense, userId: string): Promise<void>
	create(data: CreateFixedExpenseInput, userId: string): Promise<void>
	delete(id: string, userId: string): Promise<void>
}
