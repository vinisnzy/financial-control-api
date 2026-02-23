import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { CreateVariableExpenseInput } from './dtos/create-variable-expense-input.dto.js'

export interface VariableExpenseRepository {
	findAll(): Promise<VariableExpense[]>
	findById(id: string): Promise<VariableExpense | null>
	findByMonth(month: string): Promise<VariableExpense[]>
	findByCategory(category: ExpenseCategory): Promise<VariableExpense[]>
	findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<VariableExpense[]>
	findAllNecessary(): Promise<VariableExpense[]>
	findNecessaryByMonth(month: string): Promise<VariableExpense[]>

	save(expense: VariableExpense): Promise<void>
	create(data: CreateVariableExpenseInput): Promise<void>
	delete(ex: string): Promise<void>
}
