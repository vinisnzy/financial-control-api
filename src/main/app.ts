import sensible from '@fastify/sensible'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { setErrorHandler } from '@/infra/http/errors/error-handler.js'
import { registerRoutes } from '@/infra/http/routes/routes.js'

export function buildApp() {
	const app = Fastify()
	app.setValidatorCompiler(validatorCompiler)
	app.setSerializerCompiler(serializerCompiler)
	app.register(sensible)
	setErrorHandler(app)
	registerRoutes(app)
	return app.withTypeProvider<ZodTypeProvider>()
}
