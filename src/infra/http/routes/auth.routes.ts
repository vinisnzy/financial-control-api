import type { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/auth/login.controller.js'
import { registerController } from '../controllers/auth/register.controller.js'
import { loginSchema } from '../schemas/auth/login.schema.js'
import { registerSchema } from '../schemas/auth/register.schema.js'

export async function authRoutes(app: FastifyInstance) {
	app.post('/register', { schema: { body: registerSchema } }, registerController)
	app.post('/login', { schema: { body: loginSchema } }, loginController)
}
