import { InMemoryFixedExpenseRepository } from './repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { InMemoryIncomeRepository } from './repositories/income/in-memory/in-memory-income-repository.js'
import { InMemoryVariableExpenseRepository } from './repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'

export const container = {
	incomeRepository: new InMemoryIncomeRepository(),
	fixedExpenseRepository: new InMemoryFixedExpenseRepository(),
	variableExpenseRepository: new InMemoryVariableExpenseRepository(),
}
