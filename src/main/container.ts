import { FixedExpenseRepositoryPostgres } from '@/infra/database/repositories/fixed-expense-repository-postgres.js'
import { IncomeRepositoryPostgres } from '@/infra/database/repositories/income-repository-postgres.js'
import { VariableExpenseRepositoryPostgres } from '@/infra/database/repositories/variable-expense-repository-postgres.js'

export const container = {
	incomeRepository: new IncomeRepositoryPostgres(),
	fixedExpenseRepository: new FixedExpenseRepositoryPostgres(),
	variableExpenseRepository: new VariableExpenseRepositoryPostgres(),
}
