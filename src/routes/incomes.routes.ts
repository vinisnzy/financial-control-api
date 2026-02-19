import type { FastifyInstance } from 'fastify'

import { createIncomeController } from '@/controllers/income/create-income.controller.js'
import { deleteIncomeController } from '@/controllers/income/delete-income.controller.js'
import { findAllIncomesController } from '@/controllers/income/find-all-incomes.controller.js'
import { findIncomeByIdController } from '@/controllers/income/find-income-by-id.controller.js'
import { findIncomeByMonthController } from '@/controllers/income/find-income-by-month.controller.js'
import { updateIncomeController } from '@/controllers/income/update-income.controller.js'
import { createIncomeSchema } from '@/schemas/income/create-income.schema.js'
import { updateIncomeSchema } from '@/schemas/income/update-income.schema.js'
import { idParamSchema } from '@/schemas/shared/id-param.schema.js'
import { monthParamSchema } from '@/schemas/shared/month-param.schema.js'

export async function incomeRoutes(app: FastifyInstance) {
	app.post('/', { schema: { body: createIncomeSchema } }, createIncomeController)

	app.get('/', findAllIncomesController)
	app.get('/:id', { schema: { params: idParamSchema } }, findIncomeByIdController)
	app.get('/month/:month', { schema: { params: monthParamSchema } }, findIncomeByMonthController)

	app.put('/', { schema: { params: idParamSchema, body: updateIncomeSchema } }, updateIncomeController)

	app.delete('/', { schema: { params: idParamSchema } }, deleteIncomeController)
}
