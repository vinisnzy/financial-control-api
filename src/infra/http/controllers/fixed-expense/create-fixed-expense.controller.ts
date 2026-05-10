import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateFixedExpenseRequest } from '@/infra/http/schemas/fixed-expense/create-fixed-expense.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Body: CreateFixedExpenseRequest
}

export async function createFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.createFixedExpense.execute({ ...request.body, userId })
	reply.status(201).send()
}
