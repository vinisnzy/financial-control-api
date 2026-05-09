import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function findVariableExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const variableExpense = await container.findVariableExpenseById.execute(request.params.id)
	reply.send(variableExpenseEntityToResponse(variableExpense))
}
