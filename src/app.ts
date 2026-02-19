import Fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerRoutes } from './routes/routes.js'

export function buildApp() {
	const app = Fastify().withTypeProvider<ZodTypeProvider>()
	registerRoutes(app)
	return app
}
