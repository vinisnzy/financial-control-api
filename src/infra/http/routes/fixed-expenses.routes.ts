import type { FastifyInstance } from 'fastify'
import { createFixedExpenseController } from '@/infra/http/controllers/fixed-expense/create-fixed-expense.controller.js'
import { deleteFixedExpenseController } from '@/infra/http/controllers/fixed-expense/delete-fixed-expense.controller.js'
import { findAllFixedExpenseController } from '@/infra/http/controllers/fixed-expense/find-all-fixed-expenses.controller.js'
import { findAllNecessaryFixedExpensesController } from '@/infra/http/controllers/fixed-expense/find-all-necessary-fixed-expenses.controller.js'
import { findFixedExpenseByIdController } from '@/infra/http/controllers/fixed-expense/find-fixed-expense-by-id.controller.js'
import { findFixedExpensesByCategoryAndMonthController } from '@/infra/http/controllers/fixed-expense/find-fixed-expenses-by-category-and-month.controller.js'
import { findFixedExpensesByMonthController } from '@/infra/http/controllers/fixed-expense/find-fixed-expenses-by-month.controller.js'
import { findNecessaryFixedExpensesByMonthController } from '@/infra/http/controllers/fixed-expense/find-necessary-fixed-expenses-by-month.controller.js'
import { updateFixedExpenseController } from '@/infra/http/controllers/fixed-expense/update-fixed-expense.controller.js'
import { findFixedExpensesByCategoryController } from '../controllers/fixed-expense/find-fixed-expenses-by-category.controller.js'
import { categoryAndMonthParamsSchema } from '../schemas/category-and-month-params.schema.js'
import { categoryParamSchema } from '../schemas/category-param.schema.js'
import { createFixedExpenseSchema } from '../schemas/fixed-expense/create-fixed-expense.schema.js'
import { updateFixedExpenseSchema } from '../schemas/fixed-expense/update-fixed-expense.schema.js'
import { idParamSchema } from '../schemas/id-param.schema.js'
import { monthParamSchema } from '../schemas/month-param.schema.js'
import { paginationParamSchema } from '../schemas/pagination-param.schema.js'

export async function fixedExpensesRoutes(app: FastifyInstance) {
	app.post('/', { schema: { body: createFixedExpenseSchema } }, createFixedExpenseController)

	app.get('/', { schema: { querystring: paginationParamSchema } }, findAllFixedExpenseController)
	app.get('/necessary', findAllNecessaryFixedExpensesController)
	app.get(
		'/necessary/month/:month',
		{ schema: { params: monthParamSchema } },
		findNecessaryFixedExpensesByMonthController,
	)
	app.get('/:id', { schema: { params: idParamSchema } }, findFixedExpenseByIdController)
	app.get('/month/:month', { schema: { params: monthParamSchema } }, findFixedExpensesByMonthController)
	app.get('/category/:category', { schema: { params: categoryParamSchema } }, findFixedExpensesByCategoryController)
	app.get(
		'/category/:category/month/:month',
		{ schema: { params: categoryAndMonthParamsSchema } },
		findFixedExpensesByCategoryAndMonthController,
	)

	app.put('/:id', { schema: { params: idParamSchema, body: updateFixedExpenseSchema } }, updateFixedExpenseController)

	app.delete('/:id', { schema: { params: idParamSchema } }, deleteFixedExpenseController)
}
