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
import { categoryAndMonthParamsSchema } from '../schemas/category-and-month-params.schema.js'
import { categoryParamSchema } from '../schemas/category-param.schema.js'
import { idParamSchema } from '../schemas/id-param.schema.js'
import { monthParamSchema } from '../schemas/month-param.schema.js'
import { createVariableExpenseSchema } from '../schemas/variable-expense/create-variable-expense.schema.js'
import { updateVariableExpenseSchema } from '../schemas/variable-expense/update-variable-expense.schema.js'

export async function variableExpensesRoutes(app: FastifyInstance) {
	app.post('/', { schema: { body: createVariableExpenseSchema } }, createVariableExpenseController)

	app.get('/', findAllVariableExpensesController)
	app.get('/necessary', findAllNecessaryVariableExpensesController)
	app.get(
		'/necessary/month/:month',
		{ schema: { params: monthParamSchema } },
		findNecessaryVariableExpensesByMonthController,
	)
	app.get('/:id', { schema: { params: idParamSchema } }, findVariableExpenseByIdController)
	app.get('/month/:month', { schema: { params: monthParamSchema } }, findVariableExpensesByMonthController)
	app.get('/category/:category', { schema: { params: categoryParamSchema } }, findVariableExpensesByCategoryController)
	app.get(
		'/category/:category/month/:month',
		{ schema: { params: categoryAndMonthParamsSchema } },
		findVariableExpensesByCategoryAndMonthController,
	)

	app.put(
		'/:id',
		{ schema: { params: idParamSchema, body: updateVariableExpenseSchema } },
		updateVariableExpenseController,
	)

	app.delete('/:id', { schema: { params: idParamSchema } }, deleteVariableExpenseController)
}
