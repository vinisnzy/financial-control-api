import { PrismaFixedExpenseRepository } from '@/infra/database/repositories/prisma-fixed-expense-repository.js'
import { PrismaIncomeRepository } from '@/infra/database/repositories/prisma-income-repository.js'
import { PrismaVariableExpenseRepository } from '@/infra/database/repositories/prisma-variable-expense-repository.js'

export const container = {
	incomeRepository: new PrismaIncomeRepository(),
	fixedExpenseRepository: new PrismaFixedExpenseRepository(),
	variableExpenseRepository: new PrismaVariableExpenseRepository(),
}
