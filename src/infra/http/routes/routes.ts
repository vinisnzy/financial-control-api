import type { FastifyInstance } from 'fastify'
import { fixedExpensesRoutes } from './fixed-expenses.routes.js'
import { incomeRoutes } from './incomes.routes.js'
import { variableExpensesRoutes } from './variable-expenses.routes.js'

export function registerRoutes(app: FastifyInstance) {
	app.register(incomeRoutes, { prefix: '/incomes' })
	app.register(fixedExpensesRoutes, { prefix: '/fixed-expenses' })
	app.register(variableExpensesRoutes, { prefix: '/variable-expenses' })
}
