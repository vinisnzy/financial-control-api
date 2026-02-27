import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ExpenseCategory as PrismaExpenseCategory } from '@/generated/prisma/enums.js'

const prismaToDomain: Record<ExpenseCategory, PrismaExpenseCategory> = {
	[ExpenseCategory.FOOD]: PrismaExpenseCategory.FOOD,
	[ExpenseCategory.INVESTMENT]: PrismaExpenseCategory.INVESTMENT,
	[ExpenseCategory.LEISURE]: PrismaExpenseCategory.LEISURE,
	[ExpenseCategory.SUBSCRIPTION]: PrismaExpenseCategory.SUBSCRIPTION,
	[ExpenseCategory.TRANSPORT]: PrismaExpenseCategory.TRANSPORT,
}

const domainToPrisma: Record<PrismaExpenseCategory, ExpenseCategory> = {
	[PrismaExpenseCategory.FOOD]: ExpenseCategory.FOOD,
	[PrismaExpenseCategory.INVESTMENT]: ExpenseCategory.INVESTMENT,
	[PrismaExpenseCategory.LEISURE]: ExpenseCategory.LEISURE,
	[PrismaExpenseCategory.SUBSCRIPTION]: ExpenseCategory.SUBSCRIPTION,
	[PrismaExpenseCategory.TRANSPORT]: ExpenseCategory.TRANSPORT,
}

export function toPrismaExpenseCategory(category: ExpenseCategory): PrismaExpenseCategory {
	return prismaToDomain[category]
}

export function toDomainExpenseCategory(category: PrismaExpenseCategory): ExpenseCategory {
	return domainToPrisma[category]
}
