import type { FastifyInstance } from 'fastify'
import { createFixedExpenseController } from '@/controllers/fixed-expense/create-fixed-expense.controller.js'
import { deleteFixedExpenseController } from '@/controllers/fixed-expense/delete-fixed-expense.controller.js'
import { findAllFixedExpenseController } from '@/controllers/fixed-expense/find-all-fixed-expenses.controller.js'
import { findAllNecessaryFixedExpensesController } from '@/controllers/fixed-expense/find-all-necessary-fixed-expenses.controller.js'
import { findFixedExpenseByIdController } from '@/controllers/fixed-expense/find-fixed-expense-by-id.controller.js'
import { findFixedExpensesByCategoryAndMonthController } from '@/controllers/fixed-expense/find-fixed-expenses-by-category-and-month.controller.js'
import { findFixedExpensesByMonthController } from '@/controllers/fixed-expense/find-fixed-expenses-by-month.controller.js'
import { findNecessaryFixedExpensesByMonthController } from '@/controllers/fixed-expense/find-necessary-fixed-expenses-by-month.controller.js'
import { updateFixedExpenseController } from '@/controllers/fixed-expense/update-fixed-expense.controller.js'
import { findVariableExpensesByCategoryController } from '@/controllers/variable-expense/find-variable-expenses-by-category.controller.js'

export async function fixedExpensesRoutes(app: FastifyInstance) {
	app.post('/', createFixedExpenseController)

	app.get('/', findAllFixedExpenseController)
	app.get('/necessary', findAllNecessaryFixedExpensesController)
	app.get('/necessary/month/:month', findNecessaryFixedExpensesByMonthController)
	app.get('/:id', findFixedExpenseByIdController)
	app.get('/month/:month', findFixedExpensesByMonthController)
	app.get('/category/:category', findVariableExpensesByCategoryController)
	app.get('/category/:category/month/:month', findFixedExpensesByCategoryAndMonthController)

	app.put('/:id', updateFixedExpenseController)

	app.delete('/:id', deleteFixedExpenseController)
}
