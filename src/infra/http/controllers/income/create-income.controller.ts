import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateIncomeRequest } from '@/infra/http/schemas/income/create-income.schema.js'
import { container } from '@/main/server.js'

type RequestType = {
	Body: CreateIncomeRequest
}

export async function createIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.createIncome.execute({ ...request.body, userId })
	reply.status(201).send()
}
