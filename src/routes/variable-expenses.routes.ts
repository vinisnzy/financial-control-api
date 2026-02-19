import type { FastifyInstance } from 'fastify'
import { createVariableExpenseController } from '@/controllers/variable-expense/create-variable-expense.controller.js'
import { deleteVariableExpenseController } from '@/controllers/variable-expense/delete-variable-expense.controller.js'
import { findAllNecessaryVariableExpensesController } from '@/controllers/variable-expense/find-all-necessary-variable-expenses.controller.js'
import { findAllVariableExpensesController } from '@/controllers/variable-expense/find-all-variable-expenses.controller.js'
import { findNecessaryVariableExpensesByMonthController } from '@/controllers/variable-expense/find-necessary-variable-expenses-by-month.controller.js'
import { findVariableExpenseByIdController } from '@/controllers/variable-expense/find-variable-expense-by-id.controller.js'
import { findVariableExpensesByCategoryController } from '@/controllers/variable-expense/find-variable-expenses-by-category.controller.js'
import { findVariableExpensesByCategoryAndMonthController } from '@/controllers/variable-expense/find-variable-expenses-by-category-and-month.controller.js'
import { findVariableExpensesByMonthController } from '@/controllers/variable-expense/find-variable-expenses-by-month.controller.js'
import { updateVariableExpenseController } from '@/controllers/variable-expense/update-variable-expense.controller.js'
import { categoryAndMonthParamsSchema } from '@/schemas/shared/category-and-month-params.schema.js'
import { categoryParamSchema } from '@/schemas/shared/category-param.schema.js'
import { idParamSchema } from '@/schemas/shared/id-param.schema.js'
import { monthParamSchema } from '@/schemas/shared/month-param.schema.js'
import { createVariableExpenseSchema } from '@/schemas/variable-expense/create-variable-expense.schema.js'
import { updateVariableExpenseSchema } from '@/schemas/variable-expense/update-variable-expense.schema.js'

export async function variableExpensesRoutes(app: FastifyInstance) {
	app.post('/', { schema: { body: { createVariableExpenseSchema } } }, createVariableExpenseController)

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
