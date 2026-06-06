import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/server.js'

type RequestType = {
	Params: idParamRequest
}

export async function findVariableExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const variableExpense = await container.findVariableExpenseById.execute(request.params.id, userId)
	reply.send(variableExpenseEntityToResponse(variableExpense))
}
