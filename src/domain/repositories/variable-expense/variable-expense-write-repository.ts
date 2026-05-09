import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { CreateVariableExpenseInput } from './dtos/create-variable-expense-input.dto.js'

export interface VariableExpenseWriteRepository {
	save(expense: VariableExpense): Promise<void>
	create(data: CreateVariableExpenseInput): Promise<void>
	delete(id: string): Promise<void>
}
