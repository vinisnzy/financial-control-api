import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerRoutes } from '@/infra/http/routes/routes.js'

export function buildApp() {
	const app = Fastify({ logger: true })
	app.setValidatorCompiler(validatorCompiler)
	app.setSerializerCompiler(serializerCompiler)
	registerRoutes(app)
	return app.withTypeProvider<ZodTypeProvider>()
}
