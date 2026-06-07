import type { FastifyInstance } from 'fastify'
import { RegisterController } from '../controllers/auth/register.controller.js'
import { registerSchema } from '../schemas/auth/register.schema.js'

export async function authRoutes(app: FastifyInstance) {
	app.post('/register', { schema: { body: registerSchema } }, RegisterController)
}
