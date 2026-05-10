import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import { container } from '@/main/container.js'
import type { paginationParamRequest } from '../../schemas/pagination-param.schema.js'

type RequestType = {
	Querystring: paginationParamRequest
}

export async function findAllVariableExpensesController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const { page, limit } = request.query
	const result = await container.findAllVariableExpenses.execute(userId, { page, limit })
	reply.send({ ...result, data: result.data.map((e) => variableExpenseEntityToResponse(e)) })
}
