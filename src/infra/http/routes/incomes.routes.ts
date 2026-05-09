import type { FastifyInstance } from 'fastify'

import { createIncomeController } from '@/infra/http/controllers/income/create-income.controller.js'
import { deleteIncomeController } from '@/infra/http/controllers/income/delete-income.controller.js'
import { findAllIncomesController } from '@/infra/http/controllers/income/find-all-incomes.controller.js'
import { findIncomeByIdController } from '@/infra/http/controllers/income/find-income-by-id.controller.js'
import { findIncomeByMonthController } from '@/infra/http/controllers/income/find-income-by-month.controller.js'
import { updateIncomeController } from '@/infra/http/controllers/income/update-income.controller.js'
import { findIncomeByNameAndMonth } from '../controllers/income/find-income-by-name-and-month.controller.js'
import { idParamSchema } from '../schemas/id-param.schema.js'
import { createIncomeSchema } from '../schemas/income/create-income.schema.js'
import { updateIncomeSchema } from '../schemas/income/update-income.schema.js'
import { monthParamSchema } from '../schemas/month-param.schema.js'
import { nameAndMonthParamSchema } from '../schemas/name-and-month-param.schema.js'

export async function incomeRoutes(app: FastifyInstance) {
	app.post('/', { schema: { body: createIncomeSchema } }, createIncomeController)

	app.get('/', findAllIncomesController)
	app.get('/:id', { schema: { params: idParamSchema } }, findIncomeByIdController)
	app.get('/month/:month', { schema: { params: monthParamSchema } }, findIncomeByMonthController)
	app.get('/name/:name/month/:month', { schema: { params: nameAndMonthParamSchema } }, findIncomeByNameAndMonth)

	app.put('/:id', { schema: { params: idParamSchema, body: updateIncomeSchema } }, updateIncomeController)

	app.delete('/:id', { schema: { params: idParamSchema } }, deleteIncomeController)
}
