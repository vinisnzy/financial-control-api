import type { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/auth/login.controller.js'
import { refreshController } from '../controllers/auth/refresh.controller.js'
import { registerController } from '../controllers/auth/register.controller.js'
import { loginSchema } from '../schemas/auth/login.schema.js'
import { refreshSchema } from '../schemas/auth/refresh.schema.js'
import { registerSchema } from '../schemas/auth/register.schema.js'

export async function authRoutes(app: FastifyInstance) {
	app.post('/register', { schema: { body: registerSchema } }, registerController)
	app.post('/login', { schema: { body: loginSchema } }, loginController)
	app.post('/refresh', { schema: { body: refreshSchema } }, refreshController)
}
