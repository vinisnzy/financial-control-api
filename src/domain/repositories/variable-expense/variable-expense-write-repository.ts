import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { CreateVariableExpenseInput } from './dtos/create-variable-expense-input.dto.js'

export interface VariableExpenseWriteRepository {
	save(expense: VariableExpense, userId: string): Promise<void>
	create(data: CreateVariableExpenseInput, userId: string): Promise<VariableExpense>
	delete(id: string, userId: string): Promise<void>
}
