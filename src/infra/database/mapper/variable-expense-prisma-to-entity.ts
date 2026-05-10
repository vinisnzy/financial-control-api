import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpense as VariableExpensePrisma } from '@/generated/prisma/client.js'
import { toDomainExpenseCategory } from './expense-category-mapper.js'

export function variableExpensePrismaToEntity(variableExpense: VariableExpensePrisma) {
	return new VariableExpense({
		id: variableExpense.id,
		month: variableExpense.month,
		name: variableExpense.name,
		amount: Number(variableExpense.amount),
		category: toDomainExpenseCategory(variableExpense.category),
		necessary: variableExpense.necessary,
		userId: variableExpense.userId,
		date: variableExpense.date,
	})
}
