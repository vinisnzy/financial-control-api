import type { FastifyInstance } from 'fastify'
import { createVariableExpenseController } from '@/infra/http/controllers/variable-expense/create-variable-expense.controller.js'
import { deleteVariableExpenseController } from '@/infra/http/controllers/variable-expense/delete-variable-expense.controller.js'
import { findAllNecessaryVariableExpensesController } from '@/infra/http/controllers/variable-expense/find-all-necessary-variable-expenses.controller.js'
import { findAllVariableExpensesController } from '@/infra/http/controllers/variable-expense/find-all-variable-expenses.controller.js'
import { findNecessaryVariableExpensesByMonthController } from '@/infra/http/controllers/variable-expense/find-necessary-variable-expenses-by-month.controller.js'
import { findVariableExpenseByIdController } from '@/infra/http/controllers/variable-expense/find-variable-expense-by-id.controller.js'
import { findVariableExpensesByCategoryController } from '@/infra/http/controllers/variable-expense/find-variable-expenses-by-category.controller.js'
import { findVariableExpensesByCategoryAndMonthController } from '@/infra/http/controllers/variable-expense/find-variable-expenses-by-category-and-month.controller.js'
import { findVariableExpensesByMonthController } from '@/infra/http/controllers/variable-expense/find-variable-expenses-by-month.controller.js'
import { updateVariableExpenseController } from '@/infra/http/controllers/variable-expense/update-variable-expense.controller.js'

export async function variableExpensesRoutes(app: FastifyInstance) {
	app.post('/', createVariableExpenseController)

	app.get('/', findAllVariableExpensesController)
	app.get('/necessary', findAllNecessaryVariableExpensesController)
	app.get('/necessary/month/:month', findNecessaryVariableExpensesByMonthController)
	app.get('/:id', findVariableExpenseByIdController)
	app.get('/month/:month', findVariableExpensesByMonthController)
	app.get('/category/:category', findVariableExpensesByCategoryController)
	app.get('/category/:category/month/:month', findVariableExpensesByCategoryAndMonthController)

	app.put('/:id', updateVariableExpenseController)

	app.delete('/:id', deleteVariableExpenseController)
}
