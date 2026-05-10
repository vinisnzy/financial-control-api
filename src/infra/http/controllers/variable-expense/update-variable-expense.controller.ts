import type { FastifyReply, FastifyRequest } from 'fastify'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import type { UpdateVariableExpenseRequest } from '@/infra/http/schemas/variable-expense/update-variable-expense.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
	Body: UpdateVariableExpenseRequest
}

export async function updateVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.updateVariableExpense.execute(request.params.id, userId, request.body)
	reply.status(204).send()
}
