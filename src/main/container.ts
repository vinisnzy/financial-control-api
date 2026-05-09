import { CreateFixedExpenseUseCase } from '@/application/use-cases/fixed-expense/create-fixed-expense.js'
import { DeleteFixedExpenseUseCase } from '@/application/use-cases/fixed-expense/delete-fixed-expense.js'
import { FindAllFixedExpensesUseCase } from '@/application/use-cases/fixed-expense/find-all-fixed-expenses.js'
import { FindAllNecessaryFixedExpensesUseCase } from '@/application/use-cases/fixed-expense/find-all-necessary-fixed-expenses.js'
import { FindFixedExpenseByIdUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expense-by-id.js'
import { FindFixedExpensesByCategoryUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expenses-by-category.js'
import { FindFixedExpensesByCategoryAndMonthUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expenses-by-category-and-month.js'
import { FindFixedExpensesByMonthUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expenses-by-month.js'
import { FindNecessaryFixedExpensesByMonthUseCase } from '@/application/use-cases/fixed-expense/find-necessary-fixed-expenses-by-month.js'
import { UpdateFixedExpenseUseCase } from '@/application/use-cases/fixed-expense/update-fixed-expense.js'
import { CreateIncomeUseCase } from '@/application/use-cases/income/create-income.js'
import { DeleteIncomeUseCase } from '@/application/use-cases/income/delete-income.js'
import { FindAllIncomesUseCase } from '@/application/use-cases/income/find-all-incomes.js'
import { FindIncomeByIdUseCase } from '@/application/use-cases/income/find-income-by-id.js'
import { FindIncomesByMonthUseCase } from '@/application/use-cases/income/find-income-by-month.js'
import { FindIncomeByNameAndMonthUseCase } from '@/application/use-cases/income/find-income-by-name-and-month.js'
import { UpdateIncomeUseCase } from '@/application/use-cases/income/update-income.js'
import { CreateVariableExpenseUseCase } from '@/application/use-cases/variable-expense/create-variable-expense.js'
import { DeleteVariableExpenseUseCase } from '@/application/use-cases/variable-expense/delete-variable-expense.js'
import { FindAllNecessaryVariableExpensesUseCase } from '@/application/use-cases/variable-expense/find-all-necessary-variable-expenses.js'
import { FindAllVariableExpensesUseCase } from '@/application/use-cases/variable-expense/find-all-variable-expenses.js'
import { FindNecessaryVariableExpensesByMonthUseCase } from '@/application/use-cases/variable-expense/find-necessary-variable-expenses-by-month.js'
import { FindVariableExpensesByCategoryUseCase } from '@/application/use-cases/variable-expense/find-variable-expense-by-category.js'
import { FindVariableExpenseByIdUseCase } from '@/application/use-cases/variable-expense/find-variable-expense-by-id.js'
import { FindVariableExpensesByCategoryAndMonthUseCase } from '@/application/use-cases/variable-expense/find-variable-expenses-by-category-and-month.js'
import { FindVariableExpensesByMonthUseCase } from '@/application/use-cases/variable-expense/find-variable-expenses-by-month.js'
import { UpdateVariableExpenseUseCase } from '@/application/use-cases/variable-expense/update-variable-expense.js'
import { PrismaFixedExpenseRepository } from '@/infra/database/repositories/prisma-fixed-expense-repository.js'
import { PrismaIncomeRepository } from '@/infra/database/repositories/prisma-income-repository.js'
import { PrismaVariableExpenseRepository } from '@/infra/database/repositories/prisma-variable-expense-repository.js'

const incomeRepository = new PrismaIncomeRepository()
const fixedExpenseRepository = new PrismaFixedExpenseRepository()
const variableExpenseRepository = new PrismaVariableExpenseRepository()

export const container = {
	// Repositories
	incomeRepository,
	fixedExpenseRepository,
	variableExpenseRepository,

	// Incomes
	createIncome: new CreateIncomeUseCase(incomeRepository),
	updateIncome: new UpdateIncomeUseCase(incomeRepository),
	deleteIncome: new DeleteIncomeUseCase(incomeRepository),
	findAllIncomes: new FindAllIncomesUseCase(incomeRepository),
	findIncomeById: new FindIncomeByIdUseCase(incomeRepository),
	findIncomeByMonth: new FindIncomesByMonthUseCase(incomeRepository),
	findIncomeByNameAndMonth: new FindIncomeByNameAndMonthUseCase(incomeRepository),

	// Fixed Expenses
	createFixedExpense: new CreateFixedExpenseUseCase(fixedExpenseRepository),
	updateFixedExpense: new UpdateFixedExpenseUseCase(fixedExpenseRepository),
	deleteFixedExpense: new DeleteFixedExpenseUseCase(fixedExpenseRepository),
	findAllFixedExpenses: new FindAllFixedExpensesUseCase(fixedExpenseRepository),
	findFixedExpenseById: new FindFixedExpenseByIdUseCase(fixedExpenseRepository),
	findFixedExpensesByMonth: new FindFixedExpensesByMonthUseCase(fixedExpenseRepository),
	findFixedExpensesByCategory: new FindFixedExpensesByCategoryUseCase(fixedExpenseRepository),
	findFixedExpensesByCategoryAndMonth: new FindFixedExpensesByCategoryAndMonthUseCase(fixedExpenseRepository),
	findAllNecessaryFixedExpenses: new FindAllNecessaryFixedExpensesUseCase(fixedExpenseRepository),
	findNecessaryFixedExpensesByMonth: new FindNecessaryFixedExpensesByMonthUseCase(fixedExpenseRepository),

	// Variable Expenses
	createVariableExpense: new CreateVariableExpenseUseCase(variableExpenseRepository),
	updateVariableExpense: new UpdateVariableExpenseUseCase(variableExpenseRepository),
	deleteVariableExpense: new DeleteVariableExpenseUseCase(variableExpenseRepository),
	findAllVariableExpenses: new FindAllVariableExpensesUseCase(variableExpenseRepository),
	findVariableExpenseById: new FindVariableExpenseByIdUseCase(variableExpenseRepository),
	findVariableExpensesByMonth: new FindVariableExpensesByMonthUseCase(variableExpenseRepository),
	findVariableExpenseByCategory: new FindVariableExpensesByCategoryUseCase(variableExpenseRepository),
	findVariableExpensesByCategoryAndMonth: new FindVariableExpensesByCategoryAndMonthUseCase(variableExpenseRepository),
	findAllNecessaryVariableExpenses: new FindAllNecessaryVariableExpensesUseCase(variableExpenseRepository),
	findNecessaryVariableExpensesByMonth: new FindNecessaryVariableExpensesByMonthUseCase(variableExpenseRepository),
}
