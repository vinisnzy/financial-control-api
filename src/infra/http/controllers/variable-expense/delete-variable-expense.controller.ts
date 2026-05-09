import type { FastifyReply, FastifyRequest } from 'fastify'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function deleteVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	await container.deleteVariableExpense.execute(request.params.id)
	reply.status(204).send()
}
