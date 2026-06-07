import type { FastifyInstance } from 'fastify'
import { authenticate } from '../middlewares/authenticate.js'
import { authRoutes } from './auth.routes.js'
import { fixedExpensesRoutes } from './fixed-expenses.routes.js'
import { incomeRoutes } from './incomes.routes.js'
import { variableExpensesRoutes } from './variable-expenses.routes.js'

export function registerRoutes(app: FastifyInstance) {
	app.register(authRoutes, { prefix: '/auth' })

	app.addHook('preHandler', authenticate) // Authenticate the routes below

	app.register(incomeRoutes, { prefix: '/incomes' })
	app.register(fixedExpensesRoutes, { prefix: '/fixed-expenses' })
	app.register(variableExpensesRoutes, { prefix: '/variable-expenses' })
}
