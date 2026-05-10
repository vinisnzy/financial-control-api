import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateVariableExpenseRequest } from '@/infra/http/schemas/variable-expense/create-variable-expense.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Body: CreateVariableExpenseRequest
}

export async function createVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.createVariableExpense.execute({ ...request.body, userId })
	reply.status(201).send()
}
