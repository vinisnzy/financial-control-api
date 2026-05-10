import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpense as FixedExpensePrisma } from '@/generated/prisma/client.js'
import { toDomainExpenseCategory } from './expense-category-mapper.js'

export function fixedExpensePrismaToEntity(fixedExpense: FixedExpensePrisma) {
	return new FixedExpense({
		id: fixedExpense.id,
		month: fixedExpense.month,
		name: fixedExpense.name,
		amount: Number(fixedExpense.amount),
		category: toDomainExpenseCategory(fixedExpense.category),
		necessary: fixedExpense.necessary,
		userId: fixedExpense.userId,
	})
}
