import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateIncomeRequest } from '@/infra/http/schemas/income/create-income.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Body: CreateIncomeRequest
}

export async function createIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	await container.createIncome.execute(request.body)
	reply.status(201).send()
}
