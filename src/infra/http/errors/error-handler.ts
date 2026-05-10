import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

const PROBLEM_BASE_URI = 'about:blank'

type ProblemDetails = {
	type: string
	title: string
	status: number
	detail?: string
	instance: string
	errors?: Array<{ field: string; message?: string }>
}

function buildProblem(
	status: number,
	title: string,
	request: FastifyRequest,
	extras: Partial<ProblemDetails> = {},
): ProblemDetails {
	return {
		type: PROBLEM_BASE_URI,
		title,
		status,
		instance: request.url,
		...extras,
	}
}

export function setErrorHandler(app: FastifyInstance) {
	app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
		reply.header('content-type', 'application/problem+json')

		if (error.validation) {
			request.log.warn({ err: error }, 'validation error')
			return reply.status(400).send(
				buildProblem(400, 'Validation Error', request, {
					detail: 'One or more fields failed validation.',
					errors: error.validation.map((e) => ({
						field: e.instancePath.replace(/^\//, '') || (e.params?.missingProperty as string | undefined) || '',
						message: e.message,
					})),
				}),
			)
		}

		const status = error.statusCode ?? 500

		if (status >= 400 && status < 500) {
			request.log.warn({ err: error }, 'client error')
			return reply.status(status).send(
				buildProblem(status, error.name || 'Client Error', request, {
					detail: error.message,
				}),
			)
		}

		request.log.error({ err: error }, 'unexpected error')
		return reply.status(500).send(
			buildProblem(500, 'Internal Server Error', request, {
				detail: process.env.NODE_ENV === 'production' ? undefined : error.message,
			}),
		)
	})
}
