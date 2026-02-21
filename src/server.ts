import { buildApp } from './app.js'
import { CustomError } from './errors/custom-error.js'

const app = buildApp()

const port = Number(process.env.PORT) || 3333

app.setErrorHandler((error, request, reply) => {
	if (error instanceof CustomError) {
		return reply.status(error.statusCode).send({
			error: error.constructor.name,
			message: error.message,
		})
	}

	// Log
	request.log.error(error)

	return reply.status(500).send({
		error: 'InternalServerError',
		message: 'Internal server error',
	})
})

app.listen({ port }).then(() => {
	console.log(`🔥 Http server running on port: ${port} 🔥`)
})
