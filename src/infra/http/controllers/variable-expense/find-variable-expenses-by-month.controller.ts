import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import type { monthParamRequest } from '@/infra/http/schemas/month-param.schema.js'
import { container } from '@/main/server.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findVariableExpensesByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const variableExpenses = await container.findVariableExpensesByMonth.execute(request.params.month, userId)
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
