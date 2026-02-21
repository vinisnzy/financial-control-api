import type { FastifyInstance } from 'fastify'

import { createIncomeController } from '@/infra/http/controllers/income/create-income.controller.js'
import { deleteIncomeController } from '@/infra/http/controllers/income/delete-income.controller.js'
import { findAllIncomesController } from '@/infra/http/controllers/income/find-all-incomes.controller.js'
import { findIncomeByIdController } from '@/infra/http/controllers/income/find-income-by-id.controller.js'
import { findIncomeByMonthController } from '@/infra/http/controllers/income/find-income-by-month.controller.js'
import { updateIncomeController } from '@/infra/http/controllers/income/update-income.controller.js'

export async function incomeRoutes(app: FastifyInstance) {
	app.post('/', createIncomeController)

	app.get('/', findAllIncomesController)
	app.get('/:id', findIncomeByIdController)
	app.get('/month/:month', findIncomeByMonthController)

	app.put('/:id', updateIncomeController)

	app.delete('/', deleteIncomeController)
}
