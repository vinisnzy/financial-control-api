import type { FastifyReply, FastifyRequest } from 'fastify'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function deleteFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.deleteFixedExpense.execute(request.params.id, userId)
	reply.status(204).send()
}
