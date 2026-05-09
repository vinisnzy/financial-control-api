import type { FastifyReply, FastifyRequest } from 'fastify'
import type { UpdateFixedExpenseRequest } from '@/infra/http/schemas/fixed-expense/update-fixed-expense.schema.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
	Body: UpdateFixedExpenseRequest
}

export async function updateFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	await container.updateFixedExpense.execute(request.params.id, request.body)
	reply.status(204).send()
}
