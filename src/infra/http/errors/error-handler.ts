import type { FastifyInstance } from 'fastify'
import { CustomError } from '@/shared/errors/custom-error.js'

type ValidationItem = {
	instancePath: string
	message?: string
}

type FastifyValidationError = {
	validation: ValidationItem[]
	statusCode: number
	message: string
}

function isFastifyValidationError(error: unknown): error is FastifyValidationError {
	return typeof error === 'object' && error !== null && 'validation' in error
}

export function setErrorHandler(app: FastifyInstance) {
	app.setErrorHandler((error, request, reply) => {
		if (isFastifyValidationError(error)) {
			return reply.status(400).send({
				error: 'Validation error',
				errors: error.validation.map((err: ValidationItem) => ({
					field: err.instancePath.replace('/', ''),
					message: err.message,
				})),
			})
		}

		if (error instanceof CustomError) {
			return reply.status(error.statusCode).send({
				error: error.message,
			})
		}

		// Log
		request.log.error(error)

		return reply.status(500).send({
			error: 'Internal server error',
		})
	})
}
