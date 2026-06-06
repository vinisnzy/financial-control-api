import type { FastifyReply, FastifyRequest } from 'fastify'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/server.js'
import { fixedExpenseEntityToResponse } from '../../mappers/fixed-expense-to-response.js'

type RequestType = {
	Params: idParamRequest
}

export async function findFixedExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const expense = await container.findFixedExpenseById.execute(request.params.id, userId)
	reply.send(fixedExpenseEntityToResponse(expense))
}
